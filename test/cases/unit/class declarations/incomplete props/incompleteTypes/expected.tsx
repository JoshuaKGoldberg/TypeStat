import React from "react";

(function() {
    interface MyProps {
        unused: boolean;
        givenString: boolean | string;
        givenNumber: boolean | number;
        givenNumbers: boolean | Array;
    }

    class MyComponent extends React.Component<MyProps> {}

    const addsString = <MyComponent
        givenString="string"
        givenNumber={3}
        givenNumbers={[1, 2, 3]}
    />;
})();
