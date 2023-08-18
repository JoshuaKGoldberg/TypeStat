import { Mutation } from "automutate";
import * as ts from "typescript";

import {
    canNodeBeFixedForNoImplicitAny,
    getNoImplicitAnyMutations,
    NoImplictAnyNodeToBeFixed,
} from "../../../../mutations/codeFixes/noImplicitAny";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../shared/fileMutator";

export const fixNoImplicitAnyParameters: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> =>
    collectMutationsFromNodes(request, isNodeNoImplicitAnyFixableParameter, getNoImplicitAnyMutations);

const isNodeNoImplicitAnyFixableParameter = (node: ts.Node): node is ts.ParameterDeclaration & NoImplictAnyNodeToBeFixed =>
    ts.isParameter(node) && canNodeBeFixedForNoImplicitAny(node);
