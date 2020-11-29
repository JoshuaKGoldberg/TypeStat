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
texts?: { length: number, toString: Array, toLocaleString: Array, pop: Array, push: Array, concat: {  }, join: Array, reverse: Array, shift: Array, slice: Array, sort: Array, splice: {  }, unshift: Array, indexOf: Array, lastIndexOf: Array, every: {  }, some: Array, forEach: Array, map: Array, filter: {  }, reduce: {  }, reduceRight: {  }, find: {  }, findIndex: Array, fill: Array, copyWithin: Array, __@iterator: Array, entries: Array, keys: Array, values: Array, __@unscopables: Array, includes: Array };
    }

    class FunctionComponent extends React.Component<FunctionComponentProps> {
        render() {
            return this.props.texts.join('');
        }
    }

    const renderFunctionComponent = (texts: string[]) =>
        <FunctionComponent texts={texts} />;
})();
