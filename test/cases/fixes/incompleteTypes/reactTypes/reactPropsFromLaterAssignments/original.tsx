import React from 'react';

(function () {
    interface ClassComponentProps {
        other?: boolean;
    }

    class ClassComponent extends React.Component<ClassComponentProps> {
        render() {
            return this.props.text;    
        }
    }

    const renderClassComponent = (text: string) =>
        <ClassComponent text={text} />;
        
    type FunctionComponentProps =  {
        other?: boolean;
    }

    class FunctionComponent extends React.Component<FunctionComponentProps> {
        render() {
            return this.props.texts.join('');
        }
    }

    const renderFunctionComponent = (texts: string[]) =>
        <FunctionComponent texts={texts} />;

    type WithFunctionsProps = {
        returnsBoolean: Function;
        returnsStringOrNumber: () => string;
    }

    class WithFunctions extends React.Component<WithFunctionsProps> { }

    const withFunctions = <WithFunctions
        returnsBoolean={() => false}
        returnsStringOrNumber={() => 0}
    />;
})();
