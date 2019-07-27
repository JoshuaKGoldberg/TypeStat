import * as ts from "typescript";

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
