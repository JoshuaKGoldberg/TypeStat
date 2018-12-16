import * as ts from "typescript";

import { IMutation } from "automutate";
import { getNoImplicitThisMutations } from "../../mutations/codeFixes/noImplicitThis";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";

export const functionThisMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    // This fixer is only relevant if --noImplicitThis is enabled
    if (!request.options.fixes.noImplicitThis) {
        return [];
    }

    return collectMutationsFromNodes(request, ts.isFunctionDeclaration, getNoImplicitThisMutations);
};
