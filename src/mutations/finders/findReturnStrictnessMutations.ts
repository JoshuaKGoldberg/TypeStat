import { IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeAddMutation } from "../../shared/mutations";
import { addMissingAssigningNodeType, addMissingCollectedType, CollectedType, collectStrictTypesFromTypeNode } from "../../shared/types";
import { FileFixerMutationsRequest } from "../findMutationsInFile";

/**
 * Finds variable-strictness mutations for the file.
 *
 * @param request   Request options for this fixer on the file.
 * @returns Mutations for the file.
 */
export const findReturnStrictnessMutations = (request: FileFixerMutationsRequest): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];

    // Recursively search through the file to find function-likes with bodies
    const visitNode = (node: ts.Node): void => {
        if (tsutils.isFunctionWithBody(node)) {
            // Each function-like might need a return type mutation
            const mutation = getFunctionLikeMutation(node, request);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
};

/**
 * Creates a mutation to add types to a return type, if necessary.
 *
 * @param functionLike   Function with a body.
 * @param request   Request options for this fixer on the file.
 * @returns Mutation to add types to the return type, if necessary.
 */
const getFunctionLikeMutation = (functionLike: ts.FunctionLikeDeclaration, request: FileFixerMutationsRequest): IMutation | undefined => {
    // If the function-like doesn't have an explicit return type, ignore it
    const { type } = functionLike;
    if (type === undefined) {
        return undefined;
    }

    // Functions that return 'void' don't return anything, so don't check them
    if (type.kind === ts.SyntaxKind.VoidKeyword) {
        return undefined;
    }

    // Find what strict types the return type already has declared
    const declaredType = collectStrictTypesFromTypeNode(type);
    if (declaredType === CollectedType.Unknown) {
        return undefined;
    }

    // Find what strict types are later returned by the functionlike
    const missingTypes = findMissingTypesReturned(functionLike, declaredType, request);

    // Don't do anything if no types are missing or something was returned we don't know the type of
    if (missingTypes === CollectedType.None || missingTypes === CollectedType.Unknown) {
        return undefined;
    }

    return createTypeAddMutation(type.end, missingTypes, request.comment);
};

/**
 * Finds any types returned that aren't also in the function-like's declared return type.
 *
 * @param functionLike   Function with a body.
 * @param declaredType   Strict types declared in the declared return type.
 * @param request   Request options for this fixer on the file.
 * @returns Strict types missing from the declared type.
 */
const findMissingTypesReturned = (
    functionLike: ts.FunctionLikeDeclaration,
    declaredType: CollectedType,
    request: FileFixerMutationsRequest,
): CollectedType => {
    let missingTypes = CollectedType.None;

    // Search through nodes within the function-like to find all its return statements
    const visitNode = (node: ts.Node): boolean => {
        // Don't look at returns within a nested function-like signature: they return for that function
        if (tsutils.isSignatureDeclaration(node)) {
            return false;
        }

        // Add new returning types as needed when we find any 'return' statement
        if (tsutils.isReturnStatement(node)) {
            // If the node doesn't return a value, we're just missing 'undefined'
            if (node.expression === undefined) {
                missingTypes = addMissingCollectedType(declaredType, missingTypes, CollectedType.Undefined);
            }
            // If the node does return a value, Use the requesting program's type checker to find the returning type
            else {
                missingTypes = addMissingAssigningNodeType(
                    declaredType,
                    missingTypes,
                    request.services.program.getTypeChecker().getTypeAtLocation(node.expression),
                );
            }

            // If an unknown type is returned, stop ts.forEachChild iteration by returning a truthy value
            if (missingTypes === CollectedType.Unknown) {
                missingTypes = CollectedType.Unknown;
                return true;
            }
        }

        ts.forEachChild(node, visitNode);
        return false;
    };

    ts.forEachChild(functionLike, visitNode);

    return missingTypes;
};
