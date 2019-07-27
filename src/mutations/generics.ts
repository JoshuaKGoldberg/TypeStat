import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { isTypeBuiltIn } from "../shared/types";

import { createTypeName } from "./aliasing";

/**
 * Creates a type like "string[]" or "Map<boolean | number>" from a container and type arguments.
 */
export const joinIntoGenericType = (request: FileMutationsRequest, containerType: ts.Type, allTypeArgumentTypes: ts.Type[][]) => {
    const containerTypeName = createTypeName(request, containerType);
    if (containerTypeName === undefined) {
        return undefined;
    }

    // tslint:disable-next-line:no-non-null-assertion
    const genericTypeNames = allTypeArgumentTypes.map((genericTypes) => createTypeName(request, ...genericTypes)!);

    if (containerTypeName === "Array" && isTypeBuiltIn(containerType)) {
        return constructArrayShorthand(genericTypeNames);
    }

    return `${containerTypeName}<${genericTypeNames.join(", ")}>`;
};

const constructArrayShorthand = (genericTypeNames: string[]) => {
    const body = genericTypeNames.join(" | ");

    return body.includes(" ") ? `(${body})[]` : `${body}[]`;
};
