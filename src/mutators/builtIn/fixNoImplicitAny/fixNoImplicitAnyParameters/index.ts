import { IMutation } from "automutate";
import * as ts from "typescript";

import {
    canNodeBeFixedForNoImplicitAny,
    getNoImplicitAnyMutations,
    NoImplictAnyNodeToBeFixed,
} from "../../../../mutations/codeFixes/noImplicitAny";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixNoImplicitAnyParameters: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> =>
    collectMutationsFromNodes(request, isNodeNoImplicitAnyFixableParameter, getNoImplicitAnyMutations);

const isNodeNoImplicitAnyFixableParameter = (node: ts.Node): node is ts.ParameterDeclaration & NoImplictAnyNodeToBeFixed =>
    ts.isParameter(node) && canNodeBeFixedForNoImplicitAny(node);
