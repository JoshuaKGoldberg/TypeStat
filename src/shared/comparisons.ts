import * as tsutils from "ts-api-utils";
import ts, {
	isNewExpression,
	isRegularExpressionLiteral,
	isTypeReferenceNode,
} from "typescript";

import { FileMutationsRequest } from "./fileMutator.js";
import { isIntrinsicNameType, isTypeArgumentsType } from "./typeNodes.js";
import {
	getTypeAtLocationIfNotError,
	getTypeAtLocationIfNotErrorWithChecker,
} from "./types.js";

export const declaredInitializedTypeNodeIsRedundant = (
	request: FileMutationsRequest,
	declaration: ts.TypeNode,
	initializer: ts.Node,
): boolean | undefined => {
	// Most literals (e.g. `""`) have a corresponding keyword (e.g. `string`)
	switch (declaration.kind) {
		case ts.SyntaxKind.BooleanKeyword:
			return (
				initializer.kind === ts.SyntaxKind.FalseKeyword ||
				initializer.kind === ts.SyntaxKind.TrueKeyword
			);

		case ts.SyntaxKind.NullKeyword:
			return initializer.kind === ts.SyntaxKind.NullKeyword;

		case ts.SyntaxKind.NumberKeyword:
			return initializer.kind === ts.SyntaxKind.NumericLiteral;

		case ts.SyntaxKind.StringKeyword:
			return initializer.kind === ts.SyntaxKind.StringLiteral;

		// (except for `undefined`, which is an initializer one should never reassign)
		case ts.SyntaxKind.UndefinedKeyword:
			return ts.isIdentifier(initializer) && initializer.text === "undefined";
	}

	// Other types are complex enough to need the type checker...
	const declaredType = getTypeAtLocationIfNotError(request, declaration);
	if (declaredType === undefined) {
		return undefined;
	}

	// `RegExp`s are also initializers that one should never reassign
	if (isRegularExpressionLiteral(declaration)) {
		return isRegularExpressionLiteral(initializer);
	}

	const initializedType = getTypeAtLocationIfNotError(request, initializer);
	if (initializedType === undefined) {
		return undefined;
	}

	const typeChecker = request.services.program.getTypeChecker();

	const declaredText = declaredType.getSymbol()?.getEscapedName();

	// This is brute-force way to keep Map<string, number> comparison to Map without type arguments...
	// This will allow many type declarations that could be removed.
	if (
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		(declaredText === "Map" ||
			// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
			declaredText === "Set" ||
			// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
			declaredText === "ReadonlySet") &&
		typeChecker.typeToString(declaredType) !=
			typeChecker.typeToString(initializedType)
	) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
	if (declaredText === "Set") {
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
		!(
			tsutils.isUnionType(declaredType) && !tsutils.isUnionType(initializedType)
		)
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
	const declarationTypeArguments = isTypeReferenceNode(declaration)
		? declaration.typeArguments
		: undefined;
	const initalizerTypeArguments = isNewExpression(initializer)
		? initializer.typeArguments
		: undefined;

	if (
		!declarationTypeArguments?.length ||
		declarationTypeArguments.length !== initalizerTypeArguments?.length
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
			initalizerTypeArguments[i],
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
