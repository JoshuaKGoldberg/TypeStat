import * as ts from "typescript";

import { FileMutationsRequest } from "../shared/fileMutator.js";
import { isTypeBuiltIn } from "../shared/types.js";
import { constructArrayShorthand } from "./arrays.js";

/**
 * Creates a type like "string[]" or "Map<boolean | number>" from a container and type arguments.
 */
export const joinIntoGenericType = (
	request: FileMutationsRequest,
	containerType: ts.Type,
	allTypeArgumentTypes: ts.Type[][],
) => {
	const containerTypeName = request.services.printers
		.type(containerType, undefined, ts.TypeFormatFlags.WriteArrayAsGenericType)
		// Names with parameters like Array<T> and Map<K, V> should ignore those parameters
		.split("<")[0];

	// By now we're assuming the generic types can all be named

	const genericTypeNames = allTypeArgumentTypes.map(
		(genericTypes) => request.services.printers.type(genericTypes)!,
	);

	if (
		containerTypeName.split("<")[0] === "Array" &&
		isTypeBuiltIn(containerType)
	) {
		return constructArrayShorthand(genericTypeNames);
	}

	return `${containerTypeName}<${genericTypeNames.join(", ")}>`;
};
