import { IMutation } from "automutate";
import * as ts from "typescript";

import {
    canNodeBeFixedForNoImplicitAny,
    getNoImplicitAnyMutations,
    NoImplictAnyNodeToBeFixed,
} from "../../../../mutations/codeFixes/noImplicitAny";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixNoImplicitAnyPropertyDeclarations: FileMutator = (request: FileMutationsRequest): readonly IMutation[] =>
    collectMutationsFromNodes(request, isNodeNoImplicitAnyFixablePropertyDeclaration, getNoImplicitAnyMutations);

const isNodeNoImplicitAnyFixablePropertyDeclaration = (node: ts.Node): node is ts.PropertyDeclaration & NoImplictAnyNodeToBeFixed =>
    ts.isPropertyDeclaration(node) && canNodeBeFixedForNoImplicitAny(node);
