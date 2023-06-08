import { Mutation } from "automutate";
import * as ts from "typescript";

import {
    canNodeBeFixedForNoImplicitAny,
    getNoImplicitAnyMutations,
    NoImplictAnyNodeToBeFixed,
} from "../../../../mutations/codeFixes/noImplicitAny";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../shared/fileMutator";

export const fixNoImplicitAnyPropertyDeclarations: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> =>
    collectMutationsFromNodes(request, isNodeNoImplicitAnyFixablePropertyDeclaration, getNoImplicitAnyMutations);

const isNodeNoImplicitAnyFixablePropertyDeclaration = (node: ts.Node): node is ts.PropertyDeclaration & NoImplictAnyNodeToBeFixed =>
    ts.isPropertyDeclaration(node) && canNodeBeFixedForNoImplicitAny(node);
