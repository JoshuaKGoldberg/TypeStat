import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";

import { getValueDeclarationOfType, NodeSelector } from "./nodeTypes";

/**
 * Finds a node in a source file by its starting position.
 */
export const findNodeByStartingPosition = (sourceFile: ts.SourceFile, start: number): ts.Node => {
    if (start >= sourceFile.end) {
        throw new Error(`Cannot request start ${start} outside of source file '${sourceFile.fileName}'.`);
    }

    const visitNode = (node: ts.Node): ts.Node | undefined => {
        const nodeStart = node.getStart(sourceFile);
        if (nodeStart === start) {
            return node;
        }

        if (nodeStart > start || node.end < start) {
            return undefined;
        }

        return ts.forEachChild(node, visitNode);
    };

    // This function will throw an error if the node doesn't exist
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return ts.forEachChild(sourceFile, visitNode)!;
};

/**
 * Checks whether a node's position is completely within a parent node's.
 */
export const isNodeWithinNode = (sourceFile: ts.SourceFile, child: ts.Node, parent: ts.Node): boolean =>
    child.end <= parent.end && child.getStart(sourceFile) >= parent.getStart(sourceFile);

export const getParentOfKind = <TNode extends ts.Node = ts.Node>(node: ts.Node, selector: NodeSelector<TNode>): TNode | undefined => {
    if ((node.parent as ts.Node | undefined) === undefined) {
        return undefined;
    }

    node = node.parent;

    if (selector(node)) {
        return node;
    }

    return getParentOfKind(node.parent, selector);
};

/**
 * @returns Whether a node is a binary expression that sets a value with an equals token.
 * @remarks This only looks at = assignments, ignoring others such as +=.
 */
export const isNodeAssigningBinaryExpression = (node: ts.Node): node is ts.BinaryExpression =>
    ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken;

/**
 * Gets a variable initializer for an expression, if one exists.
 * If a parent is provided, it will ignore an initializer not within that parent.
 */
export const getVariableInitializerForExpression = (
    request: FileMutationsRequest,
    expression: ts.Expression,
    parentFunctionLike: ts.Block | ts.SourceFile | ts.FunctionLikeDeclaration | undefined,
): ts.Expression | undefined => {
    if (!ts.isIdentifier(expression)) {
        return undefined;
    }

    const valueDeclaration = getValueDeclarationOfType(request, expression);
    if (
        valueDeclaration === undefined ||
        (parentFunctionLike !== undefined && !isNodeWithinNode(request.sourceFile, valueDeclaration, parentFunctionLike))
    ) {
        return undefined;
    }

    if (!ts.isVariableDeclaration(valueDeclaration) || valueDeclaration.initializer === undefined) {
        return undefined;
    }

    return valueDeclaration.initializer;
};

export const getClassExtendsType = (node: ts.ClassLikeDeclaration): ts.ExpressionWithTypeArguments | undefined => {
    const { heritageClauses } = node;
    if (heritageClauses === undefined) {
        return undefined;
    }

    const classExtension = heritageClauses.find((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword);
    if (classExtension === undefined) {
        return undefined;
    }

    return classExtension.types.length === 1 ? classExtension.types[0] : undefined;
};
