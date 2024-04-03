import {
	isFalseKeyword,
	isNullKeyword,
	isTrueKeyword,
	isUnionType,
} from "ts-api-utils";
import ts from "typescript";

import { FileMutationsRequest } from "./fileMutator.js";
import { isIntrinsicNameType, isTypeArgumentsType } from "./typeNodes.js";
import {
	getTypeAtLocationIfNotError,
	getTypeAtLocationIfNotErrorWithChecker,
	isTypeBuiltIn,
} from "./types.js";

export const declaredInitializedTypeNodeIsRedundant = (
	request: FileMutationsRequest,
	declaration: ts.TypeNode,
	initializer: ts.Node,
): boolean | undefined => {
	// Most literals (e.g. `""`) have a corresponding keyword (e.g. `string`)
	switch (declaration.kind) {
		case ts.SyntaxKind.BooleanKeyword:
			return isFalseKeyword(initializer) || isTrueKeyword(initializer);

		case ts.SyntaxKind.NullKeyword:
			return isNullKeyword(initializer);

		case ts.SyntaxKind.NumberKeyword:
			return ts.isNumericLiteral(initializer);

		case ts.SyntaxKind.StringKeyword:
			return ts.isStringLiteral(initializer);

		// (except for `undefined`, which is an initializer one should never reassign)
		case ts.SyntaxKind.UndefinedKeyword:
			return ts.isIdentifier(initializer) && initializer.text === "undefined";
	}

	// `RegExp`s are also initializers that one should never reassign
	if (ts.isRegularExpressionLiteral(declaration)) {
		return ts.isRegularExpressionLiteral(initializer);
	}

	// Other types are complex enough to need the type checker...
	const declaredType = getTypeAtLocationIfNotError(request, declaration);
	if (declaredType === undefined) {
		return undefined;
	}

	const declaredText = declaredType.getSymbol()?.getEscapedName();

	// ReadonlySet is type-only, it can't be initialized. It should be never be removed.
	// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
	if (declaredText === "ReadonlySet" && isTypeBuiltIn(declaredType)) {
		return false;
	}

	const initializedType = getTypeAtLocationIfNotError(request, initializer);
	if (initializedType === undefined) {
		return undefined;
	}

	const typeChecker = request.services.program.getTypeChecker();

	// This is brute-force way to keep Map<string, number> comparison to Map without type arguments...
	// This will allow many type declarations that could be removed.
	if (
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		(declaredText === "Map" ||
			// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
			declaredText === "Set") &&
		isTypeBuiltIn(initializedType) &&
		typeChecker.typeToString(declaredType) !=
			typeChecker.typeToString(initializedType)
	) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
	if (declaredText === "Set" && isTypeBuiltIn(initializedType)) {
		return typeIsEquivalentForSet(typeChecker, declaration, initializer);
	}

	return declaredTypeIsEquivalent(typeChecker, declaredType, initializedType);
};

const declaredTypeIsEquivalent = (
	typeChecker: ts.TypeChecker,
	declaredType: ts.Type,
	initializedType: ts.Type,
): boolean => {
	// Most types, such as `string[]` / `[""]`, are generally found by this intersection...
	if (
		typeChecker.isTypeAssignableTo(declaredType, initializedType) &&
		typeChecker.isTypeAssignableTo(initializedType, declaredType) &&
		// ...though, notably, declares union types trigger false positives against non-union initializations
		!(isUnionType(declaredType) && !isUnionType(initializedType))
	) {
		return true;
	}

	// We have to hackily check for boolean types with intrinsic names...
	// `boolean[]` is really the type `[false, true]`
	if (
		isIntrinsicNameType(declaredType) &&
		isIntrinsicNameType(initializedType)
	) {
		return intrinsicNamesAreEquivalent(
			declaredType.intrinsicName,
			initializedType.intrinsicName,
		);
	}

	// If the types have the same symbol, they're likely arrays or classes with potentially comparable generics
	return typeSymbolsAndArgumentsAreEquivalent(
		typeChecker,
		declaredType,
		initializedType,
	);
};

const typeSymbolsAndArgumentsAreEquivalent = (
	typeChecker: ts.TypeChecker,
	declaredType: ts.Type,
	initializedType: ts.Type,
): boolean => {
	const declaredSymbol = declaredType.getSymbol();
	const initializedSymbol = initializedType.getSymbol();
	if (
		declaredSymbol !== initializedSymbol ||
		!isTypeArgumentsType(declaredType) ||
		!isTypeArgumentsType(initializedType) ||
		declaredType.typeArguments.length !== initializedType.typeArguments.length
	) {
		return false;
	}

	for (let i = 0; i < declaredType.typeArguments.length; i += 1) {
		const declaredTypeArgument = declaredType.typeArguments[i];
		const initializedTypeArgument = initializedType.typeArguments[i];

		if (
			!declaredTypeIsEquivalent(
				typeChecker,
				declaredTypeArgument,
				initializedTypeArgument,
			)
		) {
			return false;
		}
	}

	return true;
};

/**
 * Checks intrinsic names of types that wouldn't have been caught with `typeChecker.isTypeAssignableTo`.
 */
const intrinsicNamesAreEquivalent = (
	declaredName: string,
	initializedName: string,
): boolean => {
	switch (declaredName) {
		case "boolean":
			return initializedName === "false" || initializedName === "true";

		case "null":
			return initializedName === "null";
	}

	return false;
};

/**
 * TypeChecker completes types for some nodes. So we need to check the equivalence
 * from the node level, not from their types.
 */
const typeIsEquivalentForSet = (
	typeChecker: ts.TypeChecker,
	declaration: ts.TypeNode,
	initializer: ts.Node,
) => {
	const declarationTypeArguments = ts.isTypeReferenceNode(declaration)
		? declaration.typeArguments
		: undefined;
	const initializerTypeArguments = ts.isNewExpression(initializer)
		? initializer.typeArguments
		: undefined;

	if (
		!declarationTypeArguments?.length ||
		declarationTypeArguments.length !== initializerTypeArguments?.length
	) {
		return false;
	}

	for (let i = 0; i < declarationTypeArguments.length; i += 1) {
		const declaredTypeArgument = getTypeAtLocationIfNotErrorWithChecker(
			typeChecker,
			declarationTypeArguments[i],
		);
		const initializedTypeArgument = getTypeAtLocationIfNotErrorWithChecker(
			typeChecker,
			initializerTypeArguments[i],
		);

		if (
			!declaredTypeArgument ||
			!initializedTypeArgument ||
			!declaredTypeIsEquivalent(
				typeChecker,
				declaredTypeArgument,
				initializedTypeArgument,
			)
		) {
			return false;
		}
	}

	return true;
};
