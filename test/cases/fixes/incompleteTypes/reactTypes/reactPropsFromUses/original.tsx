import * as React from 'react';

(function () {
    interface FromUsesComponentProps {
        returnsBoolean: unknown;
        takesStringCall: unknown;
        takesNumberReturnsStringJsx: unknown;
    }

    const useReturnsBoolean = (callback: () => boolean) => {
        return callback(); 
    }

    interface ReturnsStringProps {
        takeTakesNumberReturnsString: (input: number) => string,
    }

    class WithReturnsString extends React.Component<ReturnsStringProps> {}

    const useTakesString = (callback: (text: string) => void) => {
        callback("");
    }

    class FromUsesComponent extends React.Component<FromUsesComponentProps> {
        render() {
            const { returnsBoolean, takesStringCall, takesNumberReturnsStringJsx } = this.props;

            useReturnsBoolean(returnsBoolean);
            useTakesString(takesStringCall)

            const withReturnsString = <WithReturnsString takeTakesNumberReturnsString={takesNumberReturnsStringJsx} />;

            return <span />;
        }
    }
})();
