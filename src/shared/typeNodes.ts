import * as ts from "typescript";
import { recursivelyCollectSubTypes } from "../mutations/collecting";

export type TypeWithTypeArguments = ts.Type & {
    typeArguments: ts.Type[];
};

export const isTypeArgumentsTypeNode = (type: ts.Type): type is TypeWithTypeArguments => {
    return "typeArguments" in type;
};

export type TypeWithOptionalTypeArguments = ts.Type & {
    typeArguments?: ts.Type[];
};

export const isOptionalTypeArgumentsTypeNode = (type: ts.Type): type is TypeWithOptionalTypeArguments => {
    return "typeArguments" in type;
};

export type TypeWithIntrinsicName = ts.Type & {
    intrinsicName: string;
};

export const isIntrisinicNameTypeNode = (type: ts.Type): type is TypeWithIntrinsicName => {
    return "intrinsicName" in type;
};
