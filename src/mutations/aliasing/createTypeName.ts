import ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { collectFlagsAndTypesFromTypes } from "../collecting";

import { joinIntoType } from "./joinIntoType";

/**
 * Creates a printable type name summarizing existing type(s).
 */
export const createTypeName = (request: FileMutationsRequest, ...types: ts.Type[]) => {
    // In non-strict mode, `null` and `undefined` are aliased to "".
    // If nothing is found then we know types is just an array of null and/or undefined
    for (const allowStrictNullCheckAliases of [false, true]) {
        // Find the flags and nested types from the declared type
        const [typeFlags, allTypes] = collectFlagsAndTypesFromTypes(request, types, allowStrictNullCheckAliases);

        // Join the missing types into a type string
        // Most of the time, flags and/or type names will be found on the types
        const joinedType = joinIntoType(typeFlags, allTypes, request, allowStrictNullCheckAliases);
        if (joinedType !== undefined) {
            return joinedType;
        }
    }

    return undefined;
};
