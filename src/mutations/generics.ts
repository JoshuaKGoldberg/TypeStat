import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";

import { createTypeName } from "./aliasing";

export const joinIntoGenericType = (request: FileMutationsRequest, containerType: ts.Type, allTypeArgumentTypes: ts.Type[][]) => {
    const containerTypeName = createTypeName(request, containerType);
    if (containerTypeName === undefined) {
        return undefined;
    }

    // tslint:disable-next-line: no-non-null-assertion
    const genericTypeNames = allTypeArgumentTypes.map((genericTypes) => createTypeName(request, ...genericTypes)!);

    if (containerTypeName === "Array" && isTypeBuiltIn(containerType)) {
        return constructArrayShorthand(genericTypeNames);
    }

    return `${containerTypeName}<${genericTypeNames.join(", ")}>`;
};

const isTypeBuiltIn = (type: ts.Type) => {
    const symbol = type.getSymbol();
    if (symbol === undefined) {
        return false;
    }

    const sourceFile = symbol.valueDeclaration.getSourceFile();

    return sourceFile.hasNoDefaultLib && sourceFile.isDeclarationFile && sourceFile.fileName.includes("node_modules/typescript/lib/");
};

const constructArrayShorthand = (genericTypeNames: string[]) => {
    const body = genericTypeNames.join(" | ");

    return body.includes(" ") ? `(${body})[]` : `${body}[]`;
};
