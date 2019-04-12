import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

export type TypesByName = Map<string, ts.Type[]>;

export type TypesAndNodesByName = Map<string, TypeAndNodes>;

export interface TypeAndNodes {
    memberNode: ts.PropertySignature;
    types: ts.Type[];
}

export const deduplicatePropertiesAsTypes = (request: FileMutationsRequest, properties: ReadonlyArray<ts.Symbol>): TypesByName => {
    const typesByName: TypesByName = new Map();
    const typeChecker = request.services.program.getTypeChecker();

    properties.forEach((property) => {
        const { name } = property;
        const existingTypesUnderName = typesByName.get(name);
        const type = typeChecker.getTypeOfSymbolAtLocation(property, property.valueDeclaration);

        if (existingTypesUnderName === undefined) {
            typesByName.set(name, [type]);
            return;
        }

        for (let i = 0; i < existingTypesUnderName.length; i += 1) {
            const existingType = existingTypesUnderName[i];

            if (typeChecker.isTypeAssignableTo(type, existingType)) {
                return;
            }

            if (typeChecker.isTypeAssignableTo(existingType, type)) {
                existingTypesUnderName[i] = type;
                return;
            }
        }

        existingTypesUnderName.push(type);
    });

    return typesByName;
};

export const originalTypeHasIncompleteType = (
    request: FileMutationsRequest,
    originalType: ts.Type,
    assignedTypes: ReadonlyArray<ts.Type>,
) => {
    const typeChecker = request.services.program.getTypeChecker();

    return assignedTypes.some((assignedType) => !typeChecker.isTypeAssignableTo(originalType, assignedType));
};
