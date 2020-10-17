import { FileMutationsRequest } from "../../mutators/fileMutator";

/**
 * Given a list of names, filters and aliases them per the request's preferences.
 */
export const findAliasOfTypes = (request: FileMutationsRequest, allUnionNames: ReadonlyArray<string>) => {
    // If we exclude unmatched types, remove those
    let unionNames =
        request.options.types.matching === undefined
            ? allUnionNames
            : filterMatchingTypeNames(allUnionNames, request.options.types.matching);

    if (unionNames.length === 0) {
        return undefined;
    }

    // Remove any duplicate names, since seemingly different flags or types might resolve to the same
    unionNames = [...new Set(unionNames)];

    // Alias the unioned names into what they'll be printed as
    // We intentionally don't remove duplicates here, as some aliases might be "TODO" or similar
    unionNames = unionNames.map((type) => findAliasOfType(type, request.options.types.aliases));

    return unionNames.join(" | ");
};

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

const filterMatchingTypeNames = (unionNames: ReadonlyArray<string>, matching: ReadonlyArray<string>): string[] =>
    unionNames.filter((name) => matching.some((matcher) => name.match(matcher) !== null));
