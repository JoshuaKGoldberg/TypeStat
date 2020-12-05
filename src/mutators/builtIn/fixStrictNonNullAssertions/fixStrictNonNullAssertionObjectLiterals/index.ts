import { IMutation, combineMutations } from "automutate";
import * as ts from "typescript";

import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";
import { getManuallyAssignedTypeOfNode } from "../../../../shared/assignments";
import { getStaticNameOfProperty } from "../../../../shared/names";
import { isNullOrUndefinedMissingBetween } from "../../../../shared/nodeTypes";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";

export const fixStrictNonNullAssertionObjectLiterals: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    const visitObjectLiteralExpression = (node: ts.ObjectLiteralExpression): IMutation | undefined => {
        return getStrictPropertyFix(request, node);
    };

    return collectMutationsFromNodes(request, ts.isObjectLiteralExpression, visitObjectLiteralExpression);
};

const getStrictPropertyFix = (request: FileMutationsRequest, node: ts.ObjectLiteralExpression): IMutation | undefined => {
    // Find the object type the node's properties are being assigned into
    const typeChecker = request.services.program.getTypeChecker();
    const assignedType = getManuallyAssignedTypeOfNode(typeChecker, node);
    if (assignedType === undefined) {
        return undefined;
    }

    const propertyMutations = node.properties
        // Find all properties with a nullable value being passed into a non-nullable type
        .filter((property) => {
            // Ignore any property with a name that's not immediately convertable to a string
            const propertyName = getStaticNameOfProperty(property.name);
            if (propertyName === undefined) {
                return false;
            }

            // Also ignore any properties not declared in the assigned type
            const assignedProperty = assignedType.getProperty(propertyName);
            if (!assignedProperty) {
                return false;
            }

            // We'll mutate properties that are declared as non-nullable but assigned a nullable value
            const propertyType = getTypeAtLocationIfNotError(typeChecker, property);
            return (
                propertyType !== undefined &&
                isNullOrUndefinedMissingBetween(propertyType, typeChecker.getDeclaredTypeOfSymbol(assignedProperty))
            );
        })
        // Convert each of those properties into an assertion mutation
        .map((property) => createNonNullAssertion(request, property));

    return propertyMutations.length === 0 ? undefined : combineMutations(...propertyMutations);
};
