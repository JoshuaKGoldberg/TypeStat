import * as React from 'react';

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

	const ManyProps = (props: ManyPropsProps) => <div />;

	const renderManyProps = () => [
		<ManyProps always isBoolean />,
		<ManyProps always isNumber={0} />,
		<ManyProps always isString="" />,
		<ManyProps always isNumbers={1} />,
		<ManyProps always isNumbers={2} />,
		<ManyProps always isStrings="a" />,
		<ManyProps always isStrings="b" />,
		<ManyProps always isNumberOrString={3} />,
		<ManyProps always isNumberOrString="c" />,
		<ManyProps always isNumberOrStringArray={[3]} />,
		<ManyProps always isNumberOrStringArray={["c"]} />,
		<ManyProps always isNumberOrStringArray={[3, "c"]} />,
		<ManyProps always isObject={someValue} />,
		<ManyProps always isObject={someValue} />,
	]

interface SinglePropArrowFunctionProps {
prop: number[];
}

	const SinglePropArrowFunction = ({ prop }: SinglePropArrowFunctionProps) => {
		console.log(prop);
		return <div />;
	};

	const renderSinglePropArrowFunction = () => <SinglePropArrowFunction prop={[1, 2, 3]} />;

interface SinglePropFunctionExpressionAnonymousProps {
prop: number[];
}

	const SinglePropFunctionExpressionAnonymous = function ({ prop }: SinglePropFunctionExpressionAnonymousProps) {
		console.log(prop);
		return <div />;
	};

	const renderSinglePropFunctionExpressionAnonymous = () => <SinglePropFunctionExpressionAnonymous prop={[1, 2, 3]} />;

interface FunctionExpressionNamedProps {
prop: number[];
}

	const SinglePropFunctionExpressionNamed = function FunctionExpressionNamed({ prop }: FunctionExpressionNamedProps) {
		console.log(prop);
		return <div />;
	};

	const renderSinglePropFunctionExpressionNamed = () => <SinglePropFunctionExpressionNamed prop={[1, 2, 3]} />;

interface SinglePropClassExpressionProps {
prop: number[];
}

	const SinglePropClassExpression = class extends React.Component<SinglePropClassExpressionProps> {
		render() {
			return <div />;
		}
	};

	const renderSinglePropClassExpression = () => <SinglePropClassExpression prop={[1, 2, 3]} />;

interface SinglePropClassDeclarationProps {
prop: number[];
}

	class SinglePropClassDeclaration extends React.Component<SinglePropClassDeclarationProps> {
		render() {
			return <div />;
		}
	};

	const renderSinglePropClassDeclaration = () => <SinglePropClassDeclaration prop={[1, 2, 3]} />;

})();
