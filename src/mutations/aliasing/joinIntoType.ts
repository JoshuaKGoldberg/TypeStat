import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { isNotUndefined } from "../../shared/arrays";
import { getApplicableTypeAliases } from "./aliases";

export const joinIntoType = (flags: ReadonlySet<ts.TypeFlags>, types: ReadonlySet<ts.Type>, request: FileMutationsRequest) => {
    const alias = getApplicableTypeAliases(request);

    return Array.from(
        new Set([
            ...Array.from(types).map((type) => request.services.printers.type(type)),
            ...Array.from(flags)
                .map((flag) => alias.get(flag))
                .filter(isNotUndefined),
        ]),
    ).join(" | ");
};
