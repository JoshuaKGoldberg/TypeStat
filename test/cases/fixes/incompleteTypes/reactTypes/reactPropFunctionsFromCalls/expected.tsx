import * as React from "react";

(function () {
	type WithFunctionsProps = {
		providesNothing: () => void;
		providesString: (arg0: string) => void;
		providesNumberThenString: (arg0: number, arg1: string) => void;
		providesBooleanGivesNumber: (arg0: boolean) => number;
		returnsString: () => string;
	};

	class WithFunctions extends React.Component<WithFunctionsProps> {
		onClick = () => {
			this.props.providesNothing();
			this.props.providesString("");
			this.props.providesNumberThenString(0, "");
			this.callReceiveNumber(this.props.providesBooleanGivesNumber(true));
			this.callReceiveString(this.props.returnsString());
		};

		callReceiveNumber = (value: number) => value;
		callReceiveString = (text: string) => text;
	}
})();
