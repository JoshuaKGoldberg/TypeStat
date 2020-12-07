import * as ts from "typescript";
import { FileMutationsRequest } from "../mutators/fileMutator";
import { isIntrisinicNameType } from "./typeNodes";

/**
 * @returns Whether the type has `localTypeParameters`, such as the built-in Map and Array definitions.
 */
export const typeHasLocalTypeParameters = (type: ts.Type): type is ts.InterfaceType =>
    (type as Partial<ts.InterfaceType>).localTypeParameters !== undefined;

/**
 * @returns Whether a type is from the built-in .d.ts files shipped with TypeScript.
 */
export const isTypeBuiltIn = (type: ts.Type) => {
    const symbol = type.getSymbol();
    if (symbol === undefined) {
        return false;
    }

    const sourceFile = symbol.valueDeclaration.getSourceFile();

    return sourceFile.hasNoDefaultLib && sourceFile.isDeclarationFile && sourceFile.fileName.includes("node_modules/typescript/lib/");
};

export const getSymbolAtLocationIfNotError = (request: FileMutationsRequest, node: ts.Node | undefined): ts.Symbol | undefined => {
    if (node === undefined) {
        return undefined;
    }

    const symbol = request.services.program.getTypeChecker().getSymbolAtLocation(node);

    return symbol?.declarations.length ? symbol : undefined;
};

export const getTypeAtLocationIfNotError = (request: FileMutationsRequest, node: ts.Node | undefined): ts.Type | undefined => {
    if (node === undefined) {
        return undefined;
    }

    const type = request.services.program.getTypeChecker().getTypeAtLocation(node);

    return isIntrisinicNameType(type) && type.intrinsicName === "error" ? undefined : type;
};
