import * as ts from "typescript";

import { createTypeName } from "../../../../../mutations/aliasing";
import { joinIntoGenericType } from "../../../../../mutations/generics";
import { FileMutationsRequest } from "../../../../fileMutator";

import { GenericClassDetails } from "./getGenericClassDetails";
import { VariableWithImplicitGeneric } from "./implicitGenericTypes";

/**
 * @returns Test insertion mutation if a generic type should be made explicit.
 */
export const createExplicitGenericType = (
    request: FileMutationsRequest,
    node: VariableWithImplicitGeneric,
    genericClassDetails: GenericClassDetails,
    allAssignedGenericTypes: Map<string, ts.Type[]>,
) => {
    const allTypeArgumentTypes: ts.Type[][] = [];

    // For each type parameter, collect the types assigned to it
    for (const typeParameterName of genericClassDetails.typeParameterNames) {
        const typeArgumentTypes = allAssignedGenericTypes.get(typeParameterName);
        if (typeArgumentTypes === undefined) {
            return undefined;
        }

        allTypeArgumentTypes.push(typeArgumentTypes);
    }

    // If we couldn't find any types, there's nothing to do here
    if (allTypeArgumentTypes.length === 0) {
        return undefined;
    }

    // Convert the container and its type assignments into a labeled type
    const joinedGenericType = joinIntoGenericType(request, genericClassDetails.containerType, allTypeArgumentTypes);
    if (joinedGenericType === undefined) {
        return undefined;
    }

    return {
        insertion: `: ${joinedGenericType}`,
        range: {
            begin: node.name.end,
        },
        type: "text-insert",
    };
};
