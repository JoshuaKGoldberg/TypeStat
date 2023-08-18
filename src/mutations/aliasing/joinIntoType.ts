import * as ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator";
import { isNotUndefined, uniquify } from "../../shared/arrays";
import { getApplicableTypeAliases } from "./aliases";

export const joinIntoType = (flags: ReadonlySet<ts.TypeFlags>, types: ReadonlySet<ts.Type>, request: FileMutationsRequest) => {
    const alias = getApplicableTypeAliases(request);

    return uniquify(
        ...Array.from(types)
            .map((type) => request.services.printers.type(type))
            .map((type) => (type.includes("=>") ? `(${type})` : type)),
        ...Array.from(flags)
            .map((flag) => alias.get(flag))
            .filter(isNotUndefined),
    ).join(" | ");
};
