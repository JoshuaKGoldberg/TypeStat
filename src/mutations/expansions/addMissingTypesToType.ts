import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { TypesByName } from "./eliminations";
import { getEndInsertionPoint } from "./getEndInsertionPoint";

export const addMissingTypesToType = (
    node: ts.InterfaceDeclaration | ts.TypeLiteralNode,
    missingTypes: TypesByName,
): ITextInsertMutation | undefined => {
    let insertion = "";

    for (const [name, types] of missingTypes) {
        insertion += printMissingType(name, types);
    }

    return {
        insertion,
        range: {
            begin: getEndInsertionPoint(node),
        },
        type: "text-insert",
    };
};

/**
 *
 * @todo Extract aliasing logic from `src/mutations/aliasing.ts`
 */
const printMissingType = (name: string, types: ReadonlyArray<ts.Type>): string => {
    return `${name}?: ${types.join(" | ")}`;
};
