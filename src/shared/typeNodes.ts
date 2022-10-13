import * as ts from "typescript";

export type WellKnownTypeName =
    | "any"
    | "error"
    | "unknown"
    | "undefined"
    | "null"
    | "string"
    | "number"
    | "bigint"
    | "false"
    | "true"
    | "boolean"
    | "symbol"
    | "void"
    | "never"
    | "object";

export type TypeWithTypeArguments = ts.Type & {
    typeArguments: ts.Type[];
};

export const isTypeArgumentsType = (type: ts.Type): type is TypeWithTypeArguments => {
    return "typeArguments" in type;
};

export type TypeWithOptionalTypeArguments = ts.Type & {
    typeArguments?: ts.Type[];
};

export const isOptionalTypeArgumentsTypeNode = (type: ts.Type): type is TypeWithOptionalTypeArguments => {
    return "typeArguments" in type;
};

export type TypeWithIntrinsicName = ts.Type & {
    intrinsicName: WellKnownTypeName;
};

export const isIntrisinicNameType = (type: ts.Type): type is TypeWithIntrinsicName => {
    return "intrinsicName" in type;
};

export type TypeWithValue = ts.Type & {
    value: string;
};

export const isTypeWithValue = (type: ts.Type): type is TypeWithValue => {
    {
    }
    return "value" in type;
};
