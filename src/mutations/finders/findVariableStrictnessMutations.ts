import { IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeAddMutation } from "../../shared/mutations";
import { CollectedType, collectStrictTypesFromTypeNode } from "../../shared/types";
import { FileFixerMutationsRequest } from "../findMutationsInFile";

/**
 * Finds variable-strictness mutations for the file.
 *
 * @param request   Request options for this fixer on the file.
 * @returns Mutations for the file.
 */
export const findVariableStrictnessMutations = (request: FileFixerMutationsRequest): ReadonlyArray<IMutation> => {
    const variableUsage = tsutils.collectVariableUsage(request.sourceFile);
    const mutations: IMutation[] = [];

    for (const [identifier, { uses }] of variableUsage) {
        const mutation = getVariableMutation(identifier, uses, request);

        if (mutation !== undefined) {
            mutations.push(mutation);
        }
    }

    return mutations;
};

/**
 * Creates a mutation to add types to a variable, if necessary.
 *
 * @param identifier   Identifier for a scoped variable.
 * @param uses   Locations where the variable is used in the file.
 * @param request   Request options for this fixer on the file.
 * @returns Mutation to add types to the variable, if necessary.
 */
const getVariableMutation = (
    identifier: ts.Identifier,
    uses: ReadonlyArray<tsutils.VariableUse>,
    request: FileFixerMutationsRequest,
): IMutation | undefined => {
    // Grab the variable declaration the identifier is the name of
    const variableDeclaration = identifier.parent;
    if (!tsutils.isVariableDeclaration(variableDeclaration)) {
        return undefined;
    }

    // For now, we don't do anything on variables without an explicit type declared
    // This should change for situations like `let text = ""; text = undefined;`
    const type = variableDeclaration.type;
    if (type === undefined) {
        return undefined;
    }

    // Find what strict types the variable already has declared
    const existingType = collectStrictTypesFromTypeNode(variableDeclaration.type);
    if (existingType === CollectedType.Unknown) {
        return undefined;
    }

    // Find what strict types are later assigned to the variable
    const missingTypes = findMissingTypesAssignedToVariable(variableDeclaration, existingType, uses, request);

    // Don't do anything if no types are missing or something was added we don't know the type of
    if (missingTypes === CollectedType.None || missingTypes === CollectedType.Unknown) {
        return undefined;
    }

    return createTypeAddMutation(type.end, missingTypes, request.comment);
};

/**
 * Finds any types assigned to a variable that aren't also in its declaration.
 *
 * @param variableDeclaration   Scoped variable declaration with a type.
 * @param declaredType   Strict types declared in the variable declaration.
 * @param uses   Locations where the variable is used in the file.
 * @param request   Request options for this fixer on the file.
 * @returns Strict types missing from the declared type.
 */
const findMissingTypesAssignedToVariable = (
    variableDeclaration: ts.VariableDeclaration,
    declaredType: CollectedType,
    uses: ReadonlyArray<tsutils.VariableUse>,
    request: FileFixerMutationsRequest,
): CollectedType => {
    let missingTypes = CollectedType.None;

    // If the variable has an initial value, that might assign a type to it
    if (variableDeclaration.initializer !== undefined) {
        missingTypes = addMissingAssigningType(
            declaredType,
            missingTypes,
            request.services.program.getTypeChecker().getTypeAtLocation(variableDeclaration.initializer),
        );
    }

    // Each subsequent use of the variable might assign a type to it
    for (const use of uses) {
        // Check if the use is a binary expression that assignes a type to the variable
        const useIdentifier = use.location;
        const useExpression = useIdentifier.parent;
        if (!ts.isBinaryExpression(useExpression) || useExpression.left !== useIdentifier) {
            continue;
        }

        // Use the requesting program's type checker to find the assigning type
        const assigningType = request.services.program.getTypeChecker().getTypeAtLocation(useExpression.right);

        missingTypes = addMissingAssigningType(declaredType, missingTypes, assigningType);
        if (missingTypes === CollectedType.Unknown) {
            return CollectedType.Unknown;
        }
    }

    return missingTypes;
};

/**
 * Adds any new strict types to a variable's missing types.
 *
 * @param declaredType   Strict types declared in the variable declaration.
 * @param missingTypes   Already-found types missing from the declared type.
 * @param assigningType   New assigned type to check for missing types.
 * @returns Union of the already-found missing types and any new ones.
 */
const addMissingAssigningType = (declaredType: CollectedType, missingTypes: CollectedType, assigningType: ts.Type): CollectedType => {
    // If the variable is ever assigned something of an any or unknown type there's nothing we can do
    if (tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Any) || tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Unknown)) {
        return CollectedType.Unknown;
    }

    // If not already null but assigned a type including it, null is missing
    if (!(declaredType & CollectedType.Null) && tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Null)) {
        missingTypes |= CollectedType.Null;
    }

    // If not already undefined but assigned a type including it, undefined is missing
    if (!(declaredType & CollectedType.Undefined) && tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Undefined)) {
        missingTypes |= CollectedType.Undefined;
    }

    return missingTypes;
};
