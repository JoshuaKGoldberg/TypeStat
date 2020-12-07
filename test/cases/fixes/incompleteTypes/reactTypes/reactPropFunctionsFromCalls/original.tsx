import * as React from 'react';

(function () {
    type WithFunctionsProps = {
        providesNothing: Function;
        providesString: Function;
        providesNumberThenString: Function;
        providesBooleanGivesNumber: Function;
        returnsString: Function;
    }

    class WithFunctions extends React.Component<WithFunctionsProps> {
        onClick = () => {
            this.props.providesNothing();
            this.props.providesString("");
            this.props.providesNumberThenString(0, "");
            this.callReceiveNumber(this.props.providesBooleanGivesNumber(true));
            this.callReceiveString(this.props.returnsString());
        }

        callReceiveNumber = (value: number) => value;
        callReceiveString = (text: string) => text;
    }
})();
