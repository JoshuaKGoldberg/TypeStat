import ts from "typescript";

import {
	AssignedTypeValue,
	AssignedTypesByName,
	joinAssignedTypesByName,
} from "../../../../mutations/assignments.js";
import { getCallExpressionType } from "../../../../shared/calls.js";
import { FileMutationsRequest } from "../../../../shared/fileMutator.js";
import { getStaticNameOfProperty } from "../../../../shared/names.js";
import {
	isNodeAssigningBinaryExpression,
	isNodeWithinNode,
} from "../../../../shared/nodes.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";
import { collectTypeParameterReferences } from "./collectTypeParameterReferences.js";

export const findMissingTemplateTypes = (
	request: FileMutationsRequest,
	childClass: ts.ClassLikeDeclaration,
	baseClass: ts.ClassLikeDeclaration,
): (AssignedTypesByName | string | undefined)[] => {
	// If the base class doesn't define any type parameters, we have nothing to do
	const baseTypeParameters = baseClass.typeParameters;
	if (baseTypeParameters === undefined) {
		return [];
	}

	const missingTemplateTypes: (AssignedTypesByName | string | undefined)[] = [];
	let i = 0;

	// Ignore any type parameters already declared on the class
	if (childClass.heritageClauses !== undefined) {
		for (const heritageClause of childClass.heritageClauses) {
			if (heritageClause.token === ts.SyntaxKind.ExtendsKeyword) {
				for (const heritageType of heritageClause.types) {
					if (heritageType.typeArguments !== undefined) {
						for (i; i < heritageType.typeArguments.length; i += 1) {
							missingTemplateTypes.push(undefined);
						}
					}
				}
			}
		}
	}

	// For each remaining base type parameter, collect any extra types not yet declared on it
	// For example, if it defaults to `{ exists: boolean }` but is given `.extra = 1;`, collect `extra: number`
	for (const baseTypeParameter of baseTypeParameters.slice(i)) {
		missingTemplateTypes.push(
			collectMissingParameterTypes(
				request,
				childClass,
				baseClass,
				baseTypeParameter,
			),
		);
	}

	return missingTemplateTypes;
};

const collectMissingParameterTypes = (
	request: FileMutationsRequest,
	childClass: ts.ClassLikeDeclaration,
	baseClass: ts.ClassLikeDeclaration,
	baseTypeParameter: ts.TypeParameterDeclaration,
): AssignedTypesByName | string | undefined => {
	// Each usage of the base type parameter might introduce new assigned types
	const typeParameterReferences = collectTypeParameterReferences(
		request,
		childClass,
		baseClass,
		baseTypeParameter,
	);
	if (typeParameterReferences === undefined) {
		return undefined;
	}

	// Collect all types assigned by those uses that don't already exist on the template's default
	const missingAssignedTypeValues = collectMissingAssignedParameterTypes(
		request,
		childClass,
		baseTypeParameter,
		typeParameterReferences,
	);

	// If we found known names for the node, use them as a raw string
	if (missingAssignedTypeValues instanceof Set) {
		return Array.from(missingAssignedTypeValues).join(" | ");
	}

	// If we've found nothing, the parameter checks out and shouldn't be filled in
	if (missingAssignedTypeValues.length === 0) {
		return undefined;
	}

	// If we've found missing type members, return them to indicate they should be filled in
	return joinAssignedTypesByName(request, missingAssignedTypeValues);
};

const collectMissingAssignedParameterTypes = (
	request: FileMutationsRequest,
	childClass: ts.ClassLikeDeclaration,
	baseTypeParameter: ts.TypeParameterDeclaration,
	typeParameterReferences: ts.Node[],
) => {
	const knownNames = new Set<string>();
	const assignedTypeValues: AssignedTypeValue[] = [];
	const childClassType = getTypeAtLocationIfNotError(request, childClass);
	if (childClassType === undefined) {
		return knownNames;
	}

	const defaultTypeParameterType =
		baseTypeParameter.default === undefined
			? undefined
			: getTypeAtLocationIfNotError(request, baseTypeParameter.default);

	for (const typeParameterReference of typeParameterReferences) {
		// For now, we only look at nodes whose usage is declared *within* the child class
		// In theory this could be expanded to check target instances, but that'd be more work...
		// e.g. new ClassWithGeneric().setGenericValue('it is a string');
		if (
			!isNodeWithinNode(request.sourceFile, typeParameterReference, childClass)
		) {
			continue;
		}

		const discoveredAssignedTypes = collectMissingAssignedTypesOnChildClassNode(
			request,
			childClassType,
			defaultTypeParameterType,
			typeParameterReference,
		);

		if (typeof discoveredAssignedTypes === "string") {
			knownNames.add(discoveredAssignedTypes);
		} else if (discoveredAssignedTypes !== undefined) {
			assignedTypeValues.push(discoveredAssignedTypes);
		}
	}

	// If we have any number of known names found (e.g. 'string'), use them directly
	// Otherwise use the raw descriptions of what members should go on the types
	return knownNames.size === 0 ? assignedTypeValues : knownNames;
};

const collectMissingAssignedTypesOnChildClassNode = (
	request: FileMutationsRequest,
	childClassType: ts.Type,
	defaultTypeParameterType: ts.Type | undefined,
	typeParameterReference: ts.Node,
) => {
	// If the reference is a property declaration with an initial type, use that
	if (ts.isPropertyDeclaration(typeParameterReference)) {
		return collectMissingAssignedTypeOnPropertyDeclaration(
			request,
			defaultTypeParameterType,
			typeParameterReference,
		);
	}

	const parentPropertyAccess = typeParameterReference.parent;

	// If the parent is a call, treat the reference as a parameter, and use its type directly
	if (ts.isCallOrNewExpression(parentPropertyAccess)) {
		return getMissingAssignedType(
			request,
			defaultTypeParameterType,
			typeParameterReference,
			true /* asStandaloneProperty */,
		);
	}

	// Otherwise, for now, we'll only look at references that directly access the property on some container
	if (!ts.isPropertyAccessExpression(parentPropertyAccess)) {
		return undefined;
	}

	// We only care about this node if the instance it's referencing is (or generally is a subtype of) the child class
	const expressionType = getTypeAtLocationIfNotError(
		request,
		parentPropertyAccess.expression,
	);
	if (
		expressionType === undefined ||
		!request.services.program
			.getTypeChecker()
			.isTypeAssignableTo(expressionType, childClassType)
	) {
		return undefined;
	}

	// If the grandparent is an assigning binary expression, add the right side as a full new type
	if (isNodeAssigningBinaryExpression(parentPropertyAccess.parent)) {
		return getMissingAssignedType(
			request,
			defaultTypeParameterType,
			parentPropertyAccess.parent.right,
			true /* asStandaloneProperty */,
		);
	}

	// If we're calling the member reference as a function, grab the perceived function type
	if (
		ts.isCallExpression(parentPropertyAccess.parent.parent) &&
		ts.isPropertyAccessExpression(parentPropertyAccess.parent)
	) {
		return {
			name: parentPropertyAccess.parent.name.text,
			type: getCallExpressionType(request, parentPropertyAccess.parent.parent),
		};
	}

	// Otherwise we ignore any other types
	// Eventually this will likely expand to types like property access expressions and captured identifier references
	return undefined;
};

const collectMissingAssignedTypeOnPropertyDeclaration = (
	request: FileMutationsRequest,
	defaultTypeParameterType: ts.Type | undefined,
	typeParameterReference: ts.PropertyDeclaration,
) => {
	// Our happiest case is a member that already has a named type
	if (
		typeParameterReference.type !== undefined &&
		ts.isTypeReferenceNode(typeParameterReference.type) &&
		ts.isIdentifier(typeParameterReference.type.typeName)
	) {
		return typeParameterReference.type.typeName.escapedText.toString();
	}

	// Otherwise, we'll have to manually craft a type for it
	return getMissingAssignedType(
		request,
		defaultTypeParameterType,
		typeParameterReference,
		/* asStandaloneProperty */ true,
	);
};

const getMissingAssignedType = (
	request: FileMutationsRequest,
	defaultTypeParameterType: ts.Type | undefined,
	assigningNode: ts.Node,
	asStandaloneProperty: boolean,
) => {
	const assigningType = getTypeAtLocationIfNotError(request, assigningNode);
	if (assigningType === undefined) {
		return undefined;
	}

	// If the type parameter came with a default, ignore types already equivalent to it
	if (
		defaultTypeParameterType !== undefined &&
		request.services.program
			.getTypeChecker()
			.isTypeAssignableTo(defaultTypeParameterType, assigningType)
	) {
		return undefined;
	}

	// Nodes that reach here are either 'standalone' declarations (the full type) or members thereof...
	// For a full type, go through the normal hoops to figure out its name
	if (asStandaloneProperty) {
		const standaloneType = getTypeAtLocationIfNotError(request, assigningNode);
		return standaloneType === undefined
			? undefined
			: request.services.printers.type(standaloneType);
	}

	// For a property, just grab the basic name and type, so we can join them all together later
	return {
		name: getStaticNameOfProperty(assigningNode),
		type: assigningType,
	};
};
