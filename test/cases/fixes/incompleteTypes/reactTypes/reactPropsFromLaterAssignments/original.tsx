import React from 'react';

(function () {
    // interface ClassComponentProps {
    //     other?: boolean;
    // }

    // class ClassComponent extends React.Component<ClassComponentProps> {
    //     render() {
    //         return this.props.text;    
    //     }
    // }

    // const renderClassComponent = (text: string) =>
    //     <ClassComponent text={text} />;
        
    // TODO: This should be string[] or Array<string>, not Array...
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
})();
