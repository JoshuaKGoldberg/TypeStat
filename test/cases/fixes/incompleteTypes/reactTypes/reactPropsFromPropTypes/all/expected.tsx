import React from "react";
import PropTypes from "prop-types";

(function () {

interface MyComponentProps {
    array?: any[];
    arrayRequired: any[];
    bool?: boolean;
    boolRequired: boolean;
    element?: React.ReactElement;
    elementRequired: React.ReactElement;
    func: () => void;
    funcRequired: () => void;
    instanceOfString?: String;
    instanceOfStringRequired: String;
    node?: React.ReactNode;
    nodeRequired: React.ReactNode;
    number?: number;
    numberRequired: number;
    numbers?: number[];
    numbersRequired: number[];
    numbersExact?: 1 | 2 | 3;
    numbersExactRequired: 1 | 2 | 3;
    numberType?: number;
    numberOrStringType?: number | string;
    shape?: {
        subShape?: {
            subSubNumber?: number;
            subSubNumberRequired: number;
        };
        subShapeRequired: {
            subSubNumber?: number;
            subSubNumberRequired: number;
        };
    };
    shapeRequired: {
        subShape?: {
            subSubNumber?: number;
            subSubNumberRequired: number;
        };
        subShapeRequired: {
            subSubNumber?: number;
            subSubNumberRequired: number;
        };
    };
    string?: string;
    stringRequired: string;
    strings?: "a" | "bc" | "def";
    stringsRequired: "a" | "bc" | "def";
    stringsAndNumbers?: "a" | 2 | "def" | 4;
    stringsAndNumbersRequired: "a" | 2 | "def" | 4;
    stringsType?: string;
    stringsOrNumbersType?: string | number;
}

	class MyComponent extends React.Component<MyComponentProps> {
		static propTypes = {
			array: PropTypes.array,
			arrayRequired: PropTypes.array.isRequired,
			bool: PropTypes.bool,
			boolRequired: PropTypes.bool.isRequired,
			element: PropTypes.element,
			elementRequired: PropTypes.element.isRequired,
			func: PropTypes.func,
			funcRequired: PropTypes.func.isRequired,
			instanceOfString: PropTypes.instanceOf(String),
			instanceOfStringRequired: PropTypes.instanceOf(String).isRequired,
			node: PropTypes.node,
			nodeRequired: PropTypes.node.isRequired,
			number: PropTypes.number,
			numberRequired: PropTypes.number.isRequired,
			numbers: PropTypes.arrayOf(PropTypes.number),
			numbersRequired: PropTypes.arrayOf(PropTypes.number).isRequired,
			numbersExact: PropTypes.oneOf([1, 2, 3]),
			numbersExactRequired: PropTypes.oneOf([1, 2, 3]).isRequired,
			numberType: PropTypes.oneOfType([PropTypes.number]),
			numberOrStringType: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.string,
			]),
			shape: PropTypes.shape({
				subShape: PropTypes.shape({
					subSubNumber: PropTypes.number,
					subSubNumberRequired: PropTypes.number.isRequired,
				}),
				subShapeRequired: PropTypes.shape({
					subSubNumber: PropTypes.number,
					subSubNumberRequired: PropTypes.number.isRequired,
				}).isRequired,
			}),
			shapeRequired: PropTypes.shape({
				subShape: PropTypes.shape({
					subSubNumber: PropTypes.number,
					subSubNumberRequired: PropTypes.number.isRequired,
				}),
				subShapeRequired: PropTypes.shape({
					subSubNumber: PropTypes.number,
					subSubNumberRequired: PropTypes.number.isRequired,
				}).isRequired,
			}).isRequired,
			string: PropTypes.string,
			stringRequired: PropTypes.string.isRequired,
			strings: PropTypes.oneOf(["a", "bc", "def"]),
			stringsRequired: PropTypes.oneOf(["a", "bc", "def"]).isRequired,
			stringsAndNumbers: PropTypes.oneOf(["a", 2, "def", 4]),
			stringsAndNumbersRequired: PropTypes.oneOf(["a", 2, "def", 4]).isRequired,
			stringsType: PropTypes.oneOfType([PropTypes.string]),
			stringsOrNumbersType: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
			]),
		};

		render() {
			return "";
		}
	}

interface LaterAssignedComponentProps {
    string?: string;
    stringRequired: string;
}


	class LaterAssignedComponent extends React.Component<LaterAssignedComponentProps> {
		render() {
			return "";
		}
	}

// @ts-expect-error -- TODO: Property 'propTypes' does not exist on type 'typeof LaterAssignedComponent'.
	LaterAssignedComponent.propTypes = {
		string: PropTypes.string,
		stringRequired: PropTypes.string.isRequired,
	};

interface GreetingProps {
    name?: string;
}


	class Greeting extends React.Component<GreetingProps> {
		render() {
			return <h1>Hello, {this.props.name}</h1>;
		}
	}

// @ts-expect-error -- TODO: Property 'propTypes' does not exist on type 'typeof Greeting'.
	Greeting.propTypes = {
		name: PropTypes.string,
	};

interface HelloWorldComponentProps {
    name?: string;
}

interface HelloWorldComponentProps {
    name?: string;
}



	// TODO: The mutation for this is incorrect
	function HelloWorldComponent({ name }: HelloWorldComponentProps: HelloWorldComponentProps) {
		return <div>Hello, {name}</div>;
	}

	HelloWorldComponent.propTypes = {
		name: PropTypes.string,
	};

interface HeadingProps {
    text?: string;
}

interface HeadingProps {
    text?: string;
}



	// TODO: The mutation for this is incorrect
	function Heading({ text }: HeadingProps: HeadingProps) {
		return <h1>{text}</h1>;
	}
	Heading.propTypes = {
		text: PropTypes.string,
	};
	Heading.defaultProps = {
		text: "Hello, world!",
	};
})();
