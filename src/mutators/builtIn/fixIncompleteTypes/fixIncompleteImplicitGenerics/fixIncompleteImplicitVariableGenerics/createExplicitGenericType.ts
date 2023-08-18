import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { joinIntoGenericType } from "../../../../../mutations/generics";
import { isTypeArgumentsType } from "../../../../../shared/typeNodes";
import { FileMutationsRequest } from "../../../../../shared/fileMutator";

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

    // If the node's inferred generic type already contains the later types, don't change anything
    if (allTypeArgumentTypesMatch(request, allTypeArgumentTypes, node)) {
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

const allTypeArgumentTypesMatch = (request: FileMutationsRequest, allTypeArgumentTypes: ts.Type[][], node: ts.Node) => {
    const typeChecker = request.services.program.getTypeChecker();

    // If the original type doesn't have type arguments, bail out immediately
    const originalType = typeChecker.getTypeAtLocation(node);
    if (!isTypeArgumentsType(originalType)) {
        return false;
    }

    // If the implicit type has defaulted to any, ignore it (assume a non-match)
    if (originalType.typeArguments.some((typeArgument) => tsutils.isTypeFlagSet(typeArgument, ts.TypeFlags.Any))) {
        return false;
    }

    // If the implicit types are all unknown, assume a non-match for being unknown
    if (originalType.typeArguments.every((typeArgument) => tsutils.isTypeFlagSet(typeArgument, ts.TypeFlags.Unknown))) {
        return false;
    }

    // Otherwise, check that all type arguments sub-types match the original type at the same index
    for (const typeArgumentTypes of allTypeArgumentTypes) {
        if (typeArgumentTypes.length !== originalType.typeArguments.length) {
            return false;
        }

        for (let i = 0; i < typeArgumentTypes.length; i += 1) {
            if (!typeChecker.isTypeAssignableTo(typeArgumentTypes[i], originalType.typeArguments[i])) {
                return false;
            }
        }
    }

    return true;
};
