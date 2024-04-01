import * as React from "react";

(function () {
	interface SomeValue {
		value: string;
	}

	const someValue: SomeValue = { value: "" };

	const ManyProps = (props) => <div />;

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
	];

	const SinglePropArrowFunction = ({ prop }) => {
		console.log(prop);
		return <div />;
	};

	const renderSinglePropArrowFunction = () => (
		<SinglePropArrowFunction prop={[1, 2, 3]} />
	);

	const SinglePropFunctionExpressionAnonymous = function ({ prop }) {
		console.log(prop);
		return <div />;
	};

	const renderSinglePropFunctionExpressionAnonymous = () => (
		<SinglePropFunctionExpressionAnonymous prop={[1, 2, 3]} />
	);

	const SinglePropFunctionExpressionNamed = function FunctionExpressionNamed({
		prop,
	}) {
		console.log(prop);
		return <div />;
	};

	const renderSinglePropFunctionExpressionNamed = () => (
		<SinglePropFunctionExpressionNamed prop={[1, 2, 3]} />
	);

	const SinglePropClassExpression = class extends React.Component {
		render() {
			return <div />;
		}
	};

	const renderSinglePropClassExpression = () => (
		<SinglePropClassExpression prop={[1, 2, 3]} />
	);

	class SinglePropClassDeclaration extends React.Component {
		render() {
			return <div />;
		}
	}

	const renderSinglePropClassDeclaration = () => (
		<SinglePropClassDeclaration prop={[1, 2, 3]} />
	);
})();
