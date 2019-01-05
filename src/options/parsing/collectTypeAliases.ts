import { TypeStatArgv } from "../../index";
import { arrayify } from "../../shared/arrays";
import { convertObjectToMap } from "../../shared/maps";
import { RawTypeStatTypeOptions } from "../types";

export const collectTypeAliases = (argv: TypeStatArgv, rawOptionTypes: RawTypeStatTypeOptions): ReadonlyMap<RegExp, string> | string => {
    const rawTypeAliases: Map<string, string> =
        rawOptionTypes.aliases === undefined ? new Map() : convertObjectToMap(rawOptionTypes.aliases);

    if (argv.typeAlias !== undefined) {
        for (const rawTypeAlias of arrayify(argv.typeAlias)) {
            const keyAndValue = splitRawTypeAlias(rawTypeAlias);
            if (keyAndValue === undefined) {
                return `Improper type alias: '${rawTypeAlias}'. Format these as '--typeAlias key=value'.`;
            }

            rawTypeAliases.set(keyAndValue[0], keyAndValue[1]);
        }
    }

    const regexTypeAliases = new Map<RegExp, string>();

    for (const [rawMatcher, value] of rawTypeAliases) {
        try {
            regexTypeAliases.set(new RegExp(`(.*)${rawMatcher}(.*)`), value);
        } catch (error) {
            return `Invalid type alias: '${rawMatcher}' (${error})`;
        }
    }

    return regexTypeAliases;
};

const splitRawTypeAlias = (rawTypeAlias: string): [string, string] | undefined => {
    const splitIndex = getUnescapedEqualsIndex(rawTypeAlias);

    return splitIndex <= 0 ? undefined : [rawTypeAlias.substring(0, splitIndex), rawTypeAlias.substring(splitIndex + 1)];
};

const getUnescapedEqualsIndex = (rawTypeAlias: string): number => {
    let equalsIndex = 0;

    while (true) {
        equalsIndex = rawTypeAlias.indexOf("=", equalsIndex + 1);

        if (equalsIndex === -1 || equalsIndex === rawTypeAlias.length - 1) {
            break;
        }

        if (rawTypeAlias[equalsIndex - 1] === "\\") {
            continue;
        }

        return equalsIndex;
    }

    return -1;
};
