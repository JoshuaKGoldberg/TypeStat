import * as ts from "typescript";

import { getNoImplicitThisMutations } from "../../../mutations/codeFixes/noImplicitThis";
import { collectMutationsFromNodes } from "../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../fileMutator";

export const fixNoImplicitThis: FileMutator = (request: FileMutationsRequest) =>
    request.options.fixes.noImplicitThis ? collectMutationsFromNodes(request, isThisExpression, getNoImplicitThisMutations) : undefined;

const isThisExpression = (node: ts.Node): node is ts.ThisExpression => node.kind === ts.SyntaxKind.ThisKeyword;
