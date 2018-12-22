import * as ts from "typescript";

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

    // tslint:disable-next-line:no-non-null-assertion
    return ts.forEachChild(sourceFile, visitNode)!;
};

/**
 * Checks whether a node's position is completely within a parent node's.
 */
export const isNodeWithinNode = (sourceFile: ts.SourceFile, child: ts.Node, parent: ts.Node): boolean =>
    child.end <= parent.end && child.getStart(sourceFile) >= parent.getStart(sourceFile);
