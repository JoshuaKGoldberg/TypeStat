// @ts-expect-error -- TODO: This module can only be default-imported using the 'esModuleInterop' flag
import React from "react";

(function () {
	interface ClassComponentProps {
		other?: boolean;
text?: string;
	}

	class ClassComponent extends React.Component<ClassComponentProps> {
		render() {
// @ts-expect-error -- TODO: Property 'props' does not exist on type 'ClassComponent'.
			return this.props.text;
		}
	}

// @ts-expect-error -- TODO: JSX element class does not support attributes because it does not have a 'props' property. Cannot use JSX unless the '--jsx' flag is provided. 'ClassComponent' cannot be used as a JSX component.
	const renderClassComponent = (text: string) => <ClassComponent text={text} />;

	type FunctionComponentProps = {
		other?: boolean;
texts?: string[];
	};

	class FunctionComponent extends React.Component<FunctionComponentProps> {
		render() {
// @ts-expect-error -- TODO: Property 'props' does not exist on type 'FunctionComponent'.
			return this.props.texts.join("");
		}
	}

	const renderFunctionComponent = (texts: string[]) => (
// @ts-expect-error -- TODO: JSX element class does not support attributes because it does not have a 'props' property. Cannot use JSX unless the '--jsx' flag is provided. 'FunctionComponent' cannot be used as a JSX component.
		<FunctionComponent texts={texts} />
	);

	type WithFunctionsProps = {
		returnsBoolean: (() => boolean);
		returnsStringOrNumber:( () => string) | (() => number);
	};

	class WithFunctions extends React.Component<WithFunctionsProps> {}

	const withFunctions = (
// @ts-expect-error -- TODO: JSX element class does not support attributes because it does not have a 'props' property. Cannot use JSX unless the '--jsx' flag is provided. 'WithFunctions' cannot be used as a JSX component.
		<WithFunctions
			returnsBoolean={() => false}
			returnsStringOrNumber={() => 0}
		/>
	);
})();
