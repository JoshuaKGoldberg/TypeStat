import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

import { collectFlagsAndTypesFromTypes } from "../collecting";
import { joinIntoType } from "./joinIntoType";

/**
 * Given a type name, returns its matched alias if one is found, or the type otherwise.
 *
 * @remarks
 * It's likely this could become a performance concern for projects with many type aliases.
 * If (and only if) profiling shows this to be the case, consider adding a cache to the request object.
 */
export const findAliasOfType = (type: string, aliases: ReadonlyMap<RegExp, string>): string => {
    for (const [matcher, value] of aliases) {
        if (type.match(matcher) !== null) {
            return value.replace(/\{0\}/g, type);
        }
    }

    return type;
};
