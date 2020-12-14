import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

export const joinIntoType = (flags: ReadonlySet<ts.TypeFlags>, types: ReadonlySet<ts.Type>, _request: FileMutationsRequest) => {
    return `TODO_${flags.size}_${types.size}`;
};
