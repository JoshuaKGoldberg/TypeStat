import ts from "typescript";

export type VariableWithImplicitGeneric = ts.VariableDeclaration & {
	initializer: GenericCapableInitializer;
	type: undefined;
};

type GenericCapableInitializer = ts.ArrayLiteralExpression | ts.NewExpression;

export const isVariableWithImplicitGeneric = (
	node: ts.Node,
): node is VariableWithImplicitGeneric =>
	// We'll be looking at variable declarations...
	ts.isVariableDeclaration(node) &&
	// ...without a predeclared type...
	node.type === undefined &&
	// ...but with an initially declared value...
	node.initializer !== undefined &&
	// ...that's a value we know can have a generic added
	isGenericCapableInitializer(node.initializer);

const isGenericCapableInitializer = (
	initializer: ts.Expression,
): initializer is GenericCapableInitializer => {
	// Array literals can always be generic
	if (ts.isArrayLiteralExpression(initializer)) {
		return true;
	}

	// New expressions are only valid if they don't already declare generics
	if (ts.isNewExpression(initializer)) {
		return initializer.typeArguments === undefined;
	}

	// So far, no other initializers are known to be generic capable
	return false;
};
