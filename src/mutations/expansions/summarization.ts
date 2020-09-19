import { isAssignableToType } from "ts-simple-type";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { AssignedTypesByName } from "../assignments";

export type TypeSummariesByName = Map<string, TypeSummary>;

export interface TypeSummary {
    alwaysProvided?: boolean;
    types: ts.Type[];
}

/**
 * Groups a list of assignments into, for each property name, the possible types under it and whether it's always provided.
 */
export const summarizeAllAssignedTypes = (request: FileMutationsRequest, allAssignedTypes: AssignedTypesByName[]): TypeSummariesByName => {
    const typeSummariesByName: TypeSummariesByName = new Map();

    // First, collect all assigned types from each usage into the list of types by name
    for (const assignedTypes of allAssignedTypes) {
        for (const [name, type] of assignedTypes) {
            // If this is the first time seeing the type, start a new entry for it
            const existingTypeSummary = typeSummariesByName.get(name);
            if (existingTypeSummary === undefined) {
                typeSummariesByName.set(name, { types: [type] });
                continue;
            }

            // Merge the existing types and the new type into the summary if possible
            mergeTypes(request, existingTypeSummary.types, type);
        }
    }

    // For each of summarized type, mark it as `alwaysProvided` if every set of assigned types includes it
    for (const [name, typeSummary] of typeSummariesByName) {
        if (allAssignedTypes.every((assignedTypes) => assignedTypes.has(name))) {
            typeSummary.alwaysProvided = true;
        }
    }

    return typeSummariesByName;
};

const mergeTypes = (request: FileMutationsRequest, existingTypes: ts.Type[], potentialNewType: ts.Type) => {
    const typeChecker = request.services.program.getTypeChecker();

    for (let i = 0; i < existingTypes.length; i += 1) {
        const existingType = existingTypes[i];

        if (isAssignableToType(potentialNewType, existingType, typeChecker)) {
            return;
        }

        if (isAssignableToType(existingType, potentialNewType, typeChecker)) {
            existingTypes[i] = potentialNewType;
            return;
        }
    }

    existingTypes.push(potentialNewType);
};
