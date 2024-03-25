import ts from "typescript";

import { FileMutationsRequest } from "../shared/fileMutator.js";
import { getTypeAtLocationIfNotError } from "../shared/types.js";

export interface AssignedTypeValue {
	/**
	 * Name of an added child property, if not an entirely new value literal.
	 */
	name?: string | undefined;

	/**
	 * Type being added as a property or set as a complete type.
	 * It is strongly preferable to provide this as a Type, so it can be deduplicated later on.
	 */
	type: string | ts.Type;
}

/**
 * For each new member of a type, a string or type representation of what it is known to be assigned.
 */
export type AssignedTypesByName = Map<string, string | ts.Type>;

/**
 * Joins a set of assigned type values into a single mapping by name.
 */
export const joinAssignedTypesByName = (
	request: FileMutationsRequest,
	assignedTypeValues: readonly AssignedTypeValue[],
) => {
	const assignedTypesByName = new Map<string, string | ts.Type>();

	for (const { name, type } of assignedTypeValues) {
		// If the type comes with its own name, it's for a single property
		if (name !== undefined) {
			assignedTypesByName.set(name, type);
			continue;
		}

		// Types without names are spread to convey multiple properties
		if (typeof type !== "string") {
			for (const property of type.getProperties()) {
				const declarations = property.getDeclarations();
				const relevantDeclaration =
					declarations === undefined
						? property.valueDeclaration
						: declarations[0];
				if (relevantDeclaration === undefined) {
					continue;
				}

				const propertyType = getTypeAtLocationIfNotError(
					request,
					relevantDeclaration,
				);
				if (propertyType !== undefined) {
					assignedTypesByName.set(property.name, propertyType);
				}
			}
		}
	}

	return assignedTypesByName;
};
