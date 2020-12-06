import * as React from 'react';

(function () {
    interface FromUsesComponentProps {
        returnsBoolean: () => unknown | (() => boolean);
        takesStringCall: () => void | ((text: string) => void);
        takesStringJsx: () => void | ((text: string) => string);
    }

    const useReturnsBoolean = (callback: () => boolean) => {
        return callback(); 
    }

    interface ReturnsStringProps {
        takeReturnsString: (text: string) => string,
    }

    class WithReturnsString extends React.Component<ReturnsStringProps> {}

    const useTakesString = (callback: (text: string) => void) => {
        callback("");
    }

    class FromUsesComponent extends React.Component<FromUsesComponentProps> {
        render() {
            const { returnsBoolean, takesStringCall, takesStringJsx } = this.props;

            useReturnsBoolean(returnsBoolean);
            useTakesString(takesStringCall)

            const withReturnsString = <WithReturnsString takeReturnsString={takesStringJsx} />;

            return <span />;
        }
    }
})();
