import ts from "typescript";

import { uniquify } from "../../shared/arrays.js";
import { FileMutationsRequest } from "../../shared/fileMutator.js";

export const joinIntoType = (
	types: ReadonlySet<ts.Type>,
	request: FileMutationsRequest,
) => {
	return uniquify(
		...Array.from(types)
			.map((type) => request.services.printers.type(type))
			.map((type) => (type.includes("=>") ? `(${type})` : type)),
	).join(" | ");
};
