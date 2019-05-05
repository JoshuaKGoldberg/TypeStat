import * as ts from "typescript";

import { AssignedTypesByName, AssignedTypeValue, joinAssignedTypesByName } from "../../../../mutations/assignments";
import { ExposedTypeChecker } from "../../../../mutations/createExposedTypeScript";
import { isNodeAssigningBinaryExpression } from "../../../../shared/nodes";
import { FileMutationsRequest } from "../../../fileMutator";

import { collectTypeParameterReferences } from "./collectTypeParameterReferences";

export const findMissingTemplateTypes = (
    request: FileMutationsRequest,
    childClass: ts.ClassLikeDeclaration,
    baseClass: ts.ClassLikeDeclaration,
): (AssignedTypesByName | undefined)[] => {
    // If the base class doesn't define any type parameters, we have nothing to do
    const baseTypeParameters = baseClass.typeParameters;
    if (baseTypeParameters === undefined) {
        return [];
    }

    const missingTemplateTypes: (AssignedTypesByName | undefined)[] = [];
    let i = 0;

    // Ignore any type parameters already declared on the class
    if (childClass.typeParameters !== undefined) {
        for (i; i < childClass.typeParameters.length; i += 1) {
            missingTemplateTypes.push(undefined);
        }
    }

    // For each remaining base type parameter, collect any extra types not yet declared on it
    // For example, if it defaults to `{ exists: boolean }` but is given `.extra = 1;`, collect `extra: number`
    for (const baseTypeParameter of baseTypeParameters.slice(i)) {
        missingTemplateTypes.push(collectMissingParameterTypes(request, childClass, baseTypeParameter));
    }

    return missingTemplateTypes;
};

const collectMissingParameterTypes = (
    request: FileMutationsRequest,
    childClass: ts.ClassLikeDeclaration,
    baseTypeParameter: ts.TypeParameterDeclaration,
): AssignedTypesByName | undefined => {
    const assignedTypeValues: AssignedTypeValue[] = [];

    // Each usage of the base type parameter might introduce new assigned types
    // TODO: now have to expand these generic references
    const typeParameterReferences = collectTypeParameterReferences(request, baseTypeParameter);
    if (typeParameterReferences === undefined) {
        return undefined;
    }

    const typeChecker = request.services.program.getTypeChecker();
    const childClassType = typeChecker.getTypeAtLocation(childClass);
    const baseTypeParameterType = typeChecker.getTypeAtLocation(baseTypeParameter);

    for (const typeParameterReference of typeParameterReferences) {
        const discoveredAssignedTypes = getMissingAssignedTypesOnChildClassNode(
            typeChecker,
            childClassType,
            baseTypeParameterType,
            typeParameterReference,
        );

        if (discoveredAssignedTypes !== undefined) {
            assignedTypeValues.push(discoveredAssignedTypes);
        }
    }

    // If we've found nothing, the parameter checks out and shouldn't be filled in
    if (assignedTypeValues.length === 0) {
        return undefined;
    }

    // If we've found missing types, return them to indicate they should be filled in
    return joinAssignedTypesByName(request, assignedTypeValues);
};

const getMissingAssignedTypesOnChildClassNode = (
    typeChecker: ExposedTypeChecker,
    childClassType: ts.Type,
    baseTypeParameterType: ts.Type,
    typeParameterReference: ts.Node,
) => {
    const parentPropertyAccess = typeParameterReference.parent;
    // For now, we'll only look at references that directly access the property on some container
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
        return getMissingAssignedType(typeChecker, baseTypeParameterType, parentPropertyAccess.parent.right);
    }

    // Otherwise we ignore any other types
    // Eventually this will likely expand to types like property access expressions and captured identifier references
    return undefined;
};

const getMissingAssignedType = (typeChecker: ExposedTypeChecker, baseTypeParameterType: ts.Type, rightExpression: ts.Expression) => {
    const rightExpressionType = typeChecker.getTypeAtLocation(rightExpression);
    if (typeChecker.isTypeAssignableTo(rightExpressionType, baseTypeParameterType)) {
        return undefined;
    }

    return {
        type: rightExpressionType,
    };
};
