import * as React from "react";

(function () {
	interface SomeValue {
		value: string;
	}

	const someValue: SomeValue = { value: "" };

interface ManyPropsProps {
always: boolean;
isBoolean?: boolean;
isNumber?: number;
isString?: string;
isNumbers?: number;
isStrings?: string;
isNumberOrString?: number | string;
isNumberOrStringArray?: number[] | string[] | (string | number)[];
isObject?: SomeValue;
}

// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
	const ManyProps = (props: ManyPropsProps) => <div />;

	const renderManyProps = () => [
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isBoolean />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumber={0} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isString="" />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumbers={1} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumbers={2} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isStrings="a" />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isStrings="b" />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumberOrString={3} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumberOrString="c" />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumberOrStringArray={[3]} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumberOrStringArray={["c"]} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isNumberOrStringArray={[3, "c"]} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isObject={someValue} />,
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<ManyProps always isObject={someValue} />,
	];

interface SinglePropArrowFunctionProps {
prop: number[];
}

	const SinglePropArrowFunction = ({ prop }: SinglePropArrowFunctionProps) => {
		console.log(prop);
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		return <div />;
	};

	const renderSinglePropArrowFunction = () => (
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<SinglePropArrowFunction prop={[1, 2, 3]} />
	);

interface SinglePropFunctionExpressionAnonymousProps {
prop: number[];
}

	const SinglePropFunctionExpressionAnonymous = function ({ prop }: SinglePropFunctionExpressionAnonymousProps) {
		console.log(prop);
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		return <div />;
	};

	const renderSinglePropFunctionExpressionAnonymous = () => (
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<SinglePropFunctionExpressionAnonymous prop={[1, 2, 3]} />
	);

interface FunctionExpressionNamedProps {
prop: number[];
}

	const SinglePropFunctionExpressionNamed = function FunctionExpressionNamed({
		prop,
	}: FunctionExpressionNamedProps) {
		console.log(prop);
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		return <div />;
	};

	const renderSinglePropFunctionExpressionNamed = () => (
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<SinglePropFunctionExpressionNamed prop={[1, 2, 3]} />
	);

interface SinglePropClassExpressionProps {
prop: number[];
}

	const SinglePropClassExpression = class extends React.Component<SinglePropClassExpressionProps> {
		render() {
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
			return <div />;
		}
	};

	const renderSinglePropClassExpression = () => (
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<SinglePropClassExpression prop={[1, 2, 3]} />
	);

interface SinglePropClassDeclarationProps {
prop: number[];
}

	class SinglePropClassDeclaration extends React.Component<SinglePropClassDeclarationProps> {
		render() {
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
			return <div />;
		}
	}

	const renderSinglePropClassDeclaration = () => (
// @ts-expect-error -- TODO: Cannot use JSX unless the '--jsx' flag is provided.
		<SinglePropClassDeclaration prop={[1, 2, 3]} />
	);
})();
