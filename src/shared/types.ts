import * as ts from "typescript";

/**
 * @returns Whether the type has `localTypeParameters`, such as the built-in Map and Array definitions.
 */
export const typeHasLocalTypeParameters = (type: ts.Type): type is ts.InterfaceType =>
    (type as Partial<ts.InterfaceType>).localTypeParameters !== undefined;
