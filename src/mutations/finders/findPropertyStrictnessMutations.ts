import { IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeAddMutation } from "../../shared/mutations";
import { findNodeByStartingPosition } from "../../shared/nodes";
import { addMissingAssigningNodeType, CollectedType, collectStrictTypesFromTypeNode } from "../../shared/types";
import { FileFixerMutationsRequest } from "../findMutationsInFile";

/**
 * Finds variable-strictness mutations for the file.
 *
 * @param request   Request options for this fixer on the file.
 * @returns Mutations for the file.
 */
export const findPropertyStrictnessMutations = (request: FileFixerMutationsRequest): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];

    // Recursively search through the file to find property declarations
    const visitNode = (node: ts.Node): void => {
        if (tsutils.isPropertyDeclaration(node)) {
            // Each property declaration might need a declared type mutation
            const mutation = getPropertyDeclarationMutation(node, request);

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
 * Creates a mutation to add types to a property type, if necessary.
 *
 * @param property   Property declaration within a class.
 * @param request   Request options for this fixer on the file.
 * @returns Mutation to add types to the property type, if necessary.
 */
const getPropertyDeclarationMutation = (property: ts.PropertyDeclaration, request: FileFixerMutationsRequest): IMutation | undefined => {
    // If the property doesn't have an explicit declared type, ignore it
    const { type } = property;
    if (type === undefined) {
        return undefined;
    }

    // Find what strict types the property type already has declared
    const declaredType = collectStrictTypesFromTypeNode(type);
    if (declaredType === CollectedType.Unknown) {
        return undefined;
    }

    // Find what strict types are later assigned to the property
    const missingTypes = findTypesAssignedTo(property, declaredType, request);

    // Don't do anything if no types are missing or something was returned we don't know the type of
    if (missingTypes === CollectedType.None || missingTypes === CollectedType.Unknown) {
        return undefined;
    }

    return createTypeAddMutation(type.end, missingTypes, request.comment);
};

/**
 * Finds all types assigned to a property using the language service.
 * 
 * @param property   Property declaration within a class.
 * @param declaredType   Strict types declared in the property.
 * @param request   Request options for this fixer on the file.
 * @returns Strict types missing from the property.
 */
const findTypesAssignedTo = (
    property: ts.PropertyDeclaration,
    declaredType: CollectedType,
    request: FileFixerMutationsRequest,
): CollectedType => {
    let missingTypes = CollectedType.None;

    // If the property has an initial value, that might assign a type to it
    if (property.initializer !== undefined) {
        missingTypes = addMissingAssigningNodeType(
            declaredType,
            missingTypes,
            request.services.program.getTypeChecker().getTypeAtLocation(property.initializer),
        );
    }

    // Find everything else referencing the property, since non-private properties can be assigned to in other files
    const referencedSymbols = request.services.languageService.findReferences(
        request.sourceFile.fileName,
        property.getStart(request.sourceFile),
    );
    if (referencedSymbols === undefined) {
        return missingTypes;
    }

    // Each reference symbol can have multiple references that update the missing types
    for (const referenceSymbol of referencedSymbols) {
        for (const reference of referenceSymbol.references) {
            missingTypes = updateMissingTypesForReference(reference, declaredType, missingTypes, request);
        }
    }

    return missingTypes;
};

/**
 * Adds missing tyes for a reference to a property.
 * 
 * @param reference   Source code reference to a property.
 * @param declaredType   Strict types declared in the property.
 * @param missingTypes   Types already known to be missing from the property.
 * @param request   Request options for this fixer on the file.
 * @returns Strict types missing from the property.
 */
const updateMissingTypesForReference = (
    reference: ts.ReferenceEntry,
    declaredType: CollectedType,
    missingTypes: CollectedType,
    request: FileFixerMutationsRequest,
): CollectedType => {
    // Make sure the reference is in a non-definition file and doesn't just (re-)define the property
    if (!reference.isWriteAccess || reference.isDefinition) {
        return missingTypes;
    }

    // Grab the source file containing the reference
    const referencingSourceFile = request.services.program.getSourceFile(reference.fileName);
    if (referencingSourceFile === undefined) {
        return missingTypes;
    }

    // In order to write a new type, the referencing node should be an identifier...
    const identifier = findNodeByStartingPosition(referencingSourceFile, reference.textSpan.start);
    if (!ts.isIdentifier(identifier)) {
        return missingTypes;
    }

    // ...contained as a name inside a property access...
    const propertyAccess = identifier.parent;
    if (!ts.isPropertyAccessExpression(propertyAccess) || propertyAccess.name !== identifier) {
        console.log("darn", propertyAccess);
        return missingTypes;
    }

    // ...contained as the left-hand side of an "=" binary expression
    const binaryExpression = propertyAccess.parent;
    if (
        !ts.isBinaryExpression(binaryExpression) ||
        binaryExpression.left !== propertyAccess ||
        binaryExpression.operatorToken.kind !== ts.SyntaxKind.EqualsToken
    ) {
        return missingTypes;
    }

    return addMissingAssigningNodeType(
        declaredType,
        missingTypes,
        request.services.program.getTypeChecker().getTypeAtLocation(binaryExpression.right),
    );
};
