import * as tsutils from "tsutils";
import * as ts from "typescript";

import { IMutation } from "automutate";
import { NodeMutationsRequest, NodeMutator } from "../runtime/mutator";

export const returnMutator: NodeMutator<ts.SignatureDeclaration> = {
    metadata: {
        selector: tsutils.isFunctionWithBody,
    },
    run: (node: ts.SignatureDeclaration, request: NodeMutationsRequest): IMutation | undefined => {
        // If the node has an implicit return type, don't change anything
        if (node.type === undefined) {
            return undefined;
        }

        // Collect the type initially declared as returned
        const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node.type);

        // Collect types later returned by the function
        const returnedTypes = collectFunctionReturnedTypes(node, request);

        // Add later-returned types to the node's type declaration if necessary
        return request.printer.createTypeAdditionMutation(node.type, declaredType, returnedTypes);
    },
};

/**
 * Finds any types returned that aren't also in the function-like's declared return type.
 *
 * @param signatureDeclaration   Returning signature declaration.
 * @param request   Request options for this fixer on the file.
 * @returns Strict types missing from the declared type.
 */
const collectFunctionReturnedTypes = (signatureDeclaration: ts.SignatureDeclaration, request: NodeMutationsRequest): ReadonlyArray<ts.Type> => {
    const returnedTypes: ts.Type[] = [];

    // Search through nodes within the function-like to find all its return statements
    const visitNode = (node: ts.Node): void => {
        // Don't look at returns within a nested function-like signature: they return for that function
        if (tsutils.isSignatureDeclaration(node)) {
            return;
        }

        // Add new returning types as needed when we find any 'return' statement with a value returned
        if (tsutils.isReturnStatement(node) && node.expression !== undefined) {
            returnedTypes.push(
                request.services.program.getTypeChecker().getTypeAtLocation(node.expression),
            );
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(signatureDeclaration, visitNode);

    return returnedTypes;
};