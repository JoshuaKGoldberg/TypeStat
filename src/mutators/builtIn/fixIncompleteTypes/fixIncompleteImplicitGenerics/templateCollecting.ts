import * as ts from "typescript";
import { createTypeName } from "../../../../mutations/aliasing/createTypeName";

import { AssignedTypesByName, AssignedTypeValue, joinAssignedTypesByName } from "../../../../mutations/assignments";
import { getStaticNameOfProperty } from "../../../../shared/names";
import { isNodeAssigningBinaryExpression, isNodeWithinNode } from "../../../../shared/nodes";
import { FileMutationsRequest } from "../../../fileMutator";

import { collectTypeParameterReferences } from "./collectTypeParameterReferences";

export const findMissingTemplateTypes = (
    request: FileMutationsRequest,
    childClass: ts.ClassLikeDeclaration,
    baseClass: ts.ClassLikeDeclaration,
): (string | AssignedTypesByName | undefined)[] => {
    // If the base class doesn't define any type parameters, we have nothing to do
    const baseTypeParameters = baseClass.typeParameters;
    if (baseTypeParameters === undefined) {
        return [];
    }

    const missingTemplateTypes: (string | AssignedTypesByName | undefined)[] = [];
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
        missingTemplateTypes.push(collectMissingParameterTypes(request, childClass, baseClass, baseTypeParameter));
    }

    return missingTemplateTypes;
};

const collectMissingParameterTypes = (
    request: FileMutationsRequest,
    childClass: ts.ClassLikeDeclaration,
    baseClass: ts.ClassLikeDeclaration,
    baseTypeParameter: ts.TypeParameterDeclaration,
): string | AssignedTypesByName | undefined => {
    // Each usage of the base type parameter might introduce new assigned types
    const typeParameterReferences = collectTypeParameterReferences(request, childClass, baseClass, baseTypeParameter);
    if (typeParameterReferences === undefined) {
        return undefined;
    }

    // Collect all types assigned by those uses that don't already exist on the template's default
    const missingAssignedTypeValues = collectMissingAssignedParameterTypes(request, childClass, baseTypeParameter, typeParameterReferences);

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
    const typeChecker = request.services.program.getTypeChecker();
    const childClassType = typeChecker.getTypeAtLocation(childClass);
    const defaultTypeParameterType =
        baseTypeParameter.default === undefined ? undefined : typeChecker.getTypeAtLocation(baseTypeParameter.default);

    for (const typeParameterReference of typeParameterReferences) {
        // For now, we only look at nodes whose usage is declared *within* the child class
        // In theory this could be expanded to check target instances, but that'd be more work...
        // e.g. new ClassWithGeneric().setGenericValue('it is a string');
        if (!isNodeWithinNode(request.sourceFile, typeParameterReference, childClass)) {
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
    const typeChecker = request.services.program.getTypeChecker();
    const parentPropertyAccess = typeParameterReference.parent;

    // If the parent is a call, treat the reference as a parameter, and use its type directly
    if (ts.isCallOrNewExpression(parentPropertyAccess)) {
        return getMissingAssignedType(request, defaultTypeParameterType, typeParameterReference, true /* asStandaloneProperty */);
    }

    // Otherwise, for now, we'll only look at references that directly access the property on some container
    if (!ts.isPropertyAccessExpression(parentPropertyAccess)) {
        return undefined;
    }

    // We only care about this node if the instance it's referencing is (or generally is a subtype of) the child class
    const expressionType = typeChecker.getTypeAtLocation(parentPropertyAccess.expression);
    if (!typeChecker.isTypeAssignableTo(expressionType, childClassType)) {
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

    // Otherwise we ignore any other types
    // Eventually this will likely expand to types like property access expressions and captured identifier references
    return undefined;
};

const getMissingAssignedType = (
    request: FileMutationsRequest,
    defaultTypeParameterType: ts.Type | undefined,
    assigningNode: ts.Node,
    asStandaloneProperty: boolean,
) => {
    const typeChecker = request.services.program.getTypeChecker();
    const assigningType = typeChecker.getTypeAtLocation(assigningNode);

    // If the type parameter came with a default, ignore types already equivalent to it
    if (defaultTypeParameterType !== undefined && typeChecker.isTypeAssignableTo(defaultTypeParameterType, assigningType)) {
        return undefined;
    }

    // Nodes that reach here are either 'standalone' declarations (the full type) or members thereof...
    return asStandaloneProperty
        ? // For a full type, go through the normal hoops to figure out its name
          createTypeName(request, typeChecker.getTypeAtLocation(assigningNode))
        : // For a property, just grab the basic name and type, so we can join them all together later
          {
              name: getStaticNameOfProperty(assigningNode),
              type: assigningType,
          };
};
