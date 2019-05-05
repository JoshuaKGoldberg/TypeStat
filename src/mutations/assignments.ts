import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";

export interface AssignedTypeValue {
    /**
     * Name of an added child property, if not an entirely new value literal.
     */
    name?: string;

    /**
     * Type being added as a property or set as a complete type.
     */
    type: ts.Type;
}

export type AssignedTypesByName = Map<string, ts.Type>;

/**
 * Joins a set of assigned type values into a single mapping by name.
 */
export const joinAssignedTypesByName = (request: FileMutationsRequest, assignedTypeValues: ReadonlyArray<AssignedTypeValue>) => {
    const assignedTypesByName = new Map<string, ts.Type>();

    for (const { name, type } of assignedTypeValues) {
        // If the type comes with its own name, it's for a single property
        if (name !== undefined) {
            assignedTypesByName.set(name, type);
            continue;
        }

        // Types without names are spread to convey multiple properties
        for (const property of type.getProperties()) {
            const declarations = property.getDeclarations();
            const relevantDeclaration = declarations === undefined ? property.valueDeclaration : declarations[0];
            if ((relevantDeclaration as ts.Declaration | undefined) === undefined) {
                continue;
            }

            const propertyType = request.services.program.getTypeChecker().getTypeAtLocation(relevantDeclaration);
            assignedTypesByName.set(property.name, propertyType);
        }
    }

    return assignedTypesByName;
};
