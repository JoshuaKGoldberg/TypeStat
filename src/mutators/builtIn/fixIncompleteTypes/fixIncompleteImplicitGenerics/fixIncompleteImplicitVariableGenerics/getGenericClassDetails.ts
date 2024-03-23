import ts from "typescript";

import { FileMutationsRequest } from "../../../../../shared/fileMutator.js";
import {
	getTypeAtLocationIfNotError,
	typeHasLocalTypeParameters,
} from "../../../../../shared/types.js";
import { VariableWithImplicitGeneric } from "./implicitGenericTypes.js";

/**
 * For a generic type, its type parameter names and member functions that use them.
 */
export interface GenericClassDetails {
	/**
	 * Type of the underlying class (often an interface).
	 */
	containerType: ts.InterfaceType;

	/**
	 * Maps from member names to the parameter index and types associated with a type parameter.
	 * For example, in Array, that would be `{ "push" => { 0 => (T) } }`
	 */
	membersWithGenericParameters: Map<
		string,
		Map<number, ParameterTypeNodeSummary>
	>;

	/**
	 * Ordered names of (local) type parameters on the type.
	 */
	typeParameterNames: readonly string[];
}

export type ParameterTypeNode = ts.TypeNode & {
	parent: ts.ParameterDeclaration;
};

export interface ParameterTypeNodeSummary {
	parameterName: string;
	parameterType: ParameterTypeNode;
}

export const getGenericClassDetails = (
	request: FileMutationsRequest,
	node: VariableWithImplicitGeneric,
) => {
	// Get the backing type of the variable's initializer
	const initializerType = getTypeAtLocationIfNotError(
		request,
		node.initializer,
	);
	const initializerSymbol = initializerType?.getSymbol();
	if (initializerSymbol === undefined) {
		return undefined;
	}

	// We'll be looking at the list of members available on that type
	const initializerMembers = initializerSymbol.members;
	if (initializerMembers === undefined || initializerMembers.size === 0) {
		return undefined;
	}

	// Only care about types that have at least one (local?) type parameter
	const typeChecker = request.services.program.getTypeChecker();
	const containerType = typeChecker.getDeclaredTypeOfSymbol(initializerSymbol);
	if (
		!typeHasLocalTypeParameters(containerType) ||
		containerType.localTypeParameters === undefined ||
		containerType.localTypeParameters.length === 0
	) {
		return undefined;
	}

	// Create the summary of type parameter names with relevant member functions
	return fillMembersWithGenericParameters(
		containerType,
		containerType.localTypeParameters.map(
			(typeParameter) => typeParameter.symbol.name,
		),
		initializerMembers,
	);
};

/**
 * @returns For the container type, type parameter names with member functions that use them
 */
const fillMembersWithGenericParameters = (
	containerType: ts.InterfaceType,
	typeParameterNames: readonly string[],
	initializerMembers: Map<ts.__String, ts.Symbol>,
): GenericClassDetails => {
	const membersWithGenericParameters = new Map<
		string,
		Map<number, ParameterTypeNodeSummary>
	>();
	const typeParameterNamesSet = new Set(typeParameterNames);

	/**
	 * If a parameter's type name is a reference to a local parameter, adds it to the mapping.
	 */
	const setMemberWithGenericParameterIfMatched = (
		memberName: string,
		parameterIndex: number,
		typeName: ts.Node,
		parameterType: ParameterTypeNode,
	) => {
		if (!ts.isIdentifier(typeName)) {
			return;
		}

		const parameterName = typeName.text;
		if (!typeParameterNamesSet.has(parameterName)) {
			return;
		}

		const existing = membersWithGenericParameters.get(memberName);
		const summary = { parameterName, parameterType };

		if (existing === undefined) {
			membersWithGenericParameters.set(
				memberName,
				new Map([[parameterIndex, summary]]),
			);
		} else {
			existing.set(parameterIndex, summary);
		}
	};

	// We'll be looking through all members declared on the backing initializer's type
	initializerMembers.forEach((memberSymbol) => {
		// Skip the member if it's the type itself, as that might be included in .members
		const memberName = memberSymbol.name;
		if (typeParameterNamesSet.has(memberName)) {
			return;
		}

		// We only care about parameters that can receive instances of the generic type
		const { valueDeclaration } = memberSymbol;
		if (!ts.isFunctionLike(valueDeclaration)) {
			return;
		}

		for (let i = 0; i < valueDeclaration.parameters.length; i += 1) {
			const parameter = valueDeclaration.parameters[i];
			const parameterType = parameter.type as ParameterTypeNode | undefined;
			if (parameterType === undefined) {
				continue;
			}

			// Case: indexOf(item: T)
			// Add the parameter if the direct T type matches
			if (ts.isTypeReferenceNode(parameterType)) {
				setMemberWithGenericParameterIfMatched(
					memberName,
					i,
					parameterType.typeName,
					parameterType,
				);
				continue;
			}

			// Case: push(...items: T[])
			// Add the parameter if the T within the array type matches
			if (
				ts.isArrayTypeNode(parameterType) &&
				ts.isTypeReferenceNode(parameterType.elementType)
			) {
				setMemberWithGenericParameterIfMatched(
					memberName,
					i,
					parameterType.elementType.typeName,
					parameterType,
				);
				continue;
			}

			// There could probably be more cases here, such as `concat(...items: ConcatArray<T>[])`,
			// For now the `item: T` and `...items: T[]` cases capture most uses of built-in generics
		}
	});

	return { containerType, membersWithGenericParameters, typeParameterNames };
};
