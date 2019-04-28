import * as ts from "typescript";

export type TypeWithTypeArguments = ts.Type & {
    typeArguments: ts.Type[];
};

export const isTypeArgumentsTypeNode = (type: ts.Type): type is TypeWithTypeArguments => {
    return "typeArguments" in type;
};
