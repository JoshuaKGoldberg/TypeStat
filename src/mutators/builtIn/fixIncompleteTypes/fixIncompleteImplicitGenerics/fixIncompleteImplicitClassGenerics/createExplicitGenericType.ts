import * as ts from "typescript";

import { createTypeName } from "../../../../../mutations/aliasing";
import { joinIntoGenericType } from "../../../../../mutations/generics";
import { FileMutationsRequest } from "../../../../fileMutator";

import { GenericClassDetails } from "./getGenericClassDetails";
import { VariableWithImplicitGeneric } from "./implicitGenericTypes";

export const createExplicitGenericType = (
    request: FileMutationsRequest,
    node: VariableWithImplicitGeneric,
    genericClassDetails: GenericClassDetails,
    allAssignedGenericTypes: Map<string, ts.Type[]>,
) => {
    const allTypeArgumentTypes: ts.Type[][] = [];

    for (const typeParameterName of genericClassDetails.typeParameterNames) {
        const typeArgumentTypes = allAssignedGenericTypes.get(typeParameterName);
        if (typeArgumentTypes === undefined) {
            return undefined;
        }

        allTypeArgumentTypes.push(typeArgumentTypes);
    }

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
