import { convertObjectToMap } from "../../shared/maps";
import { RawTypeStatTypeOptions } from "../types";

export const collectTypeAliases = (rawOptionTypes: RawTypeStatTypeOptions): ReadonlyMap<RegExp, string> | string => {
    const rawTypeAliases: Map<string, string> =
        rawOptionTypes.aliases === undefined ? new Map() : convertObjectToMap(rawOptionTypes.aliases);

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
