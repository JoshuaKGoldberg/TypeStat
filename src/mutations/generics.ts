import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { isTypeBuiltIn } from "../shared/types";

import { constructArrayShorthand } from "./arrays";

/**
 * Creates a type like "string[]" or "Map<boolean | number>" from a container and type arguments.
 */
export const joinIntoGenericType = (request: FileMutationsRequest, containerType: ts.Type, allTypeArgumentTypes: ts.Type[][]) => {
    const containerTypeName = request.services.printers.type(containerType);

    // By now we're assuming the generic types can all be named
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const genericTypeNames = allTypeArgumentTypes.map((genericTypes) => request.services.printers.type(genericTypes)!);

    if (containerTypeName === "Array" && isTypeBuiltIn(containerType)) {
        return constructArrayShorthand(genericTypeNames);
    }

    return `${containerTypeName}<${genericTypeNames.join(", ")}>`;
};
