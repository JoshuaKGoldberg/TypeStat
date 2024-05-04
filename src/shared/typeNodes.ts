import ts from "typescript";

export type WellKnownTypeName =
	| "any"
	| "bigint"
	| "boolean"
	| "error"
	| "false"
	| "never"
	| "null"
	| "number"
	| "object"
	| "string"
	| "symbol"
	| "true"
	| "undefined"
	| "unknown"
	| "void";

export type TypeWithTypeArguments = {
	typeArguments: ts.Type[];
} & ts.Type;

export const isTypeArgumentsType = (
	type: ts.Type,
): type is TypeWithTypeArguments => {
	return "typeArguments" in type && !!type.typeArguments;
};

export type TypeWithOptionalTypeArguments = {
	typeArguments?: ts.Type[];
} & ts.Type;

export const isOptionalTypeArgumentsTypeNode = (
	type: ts.Type,
): type is TypeWithOptionalTypeArguments => {
	return "typeArguments" in type;
};

export type TypeWithIntrinsicName = {
	intrinsicName: WellKnownTypeName;
} & ts.Type;

export const isIntrinsicNameType = (
	type: ts.Type,
): type is TypeWithIntrinsicName => {
	return "intrinsicName" in type;
};
