import React from "react";

(function() {
    interface MyProps {
        unused: boolean;
    }

    class MyComponent extends React.Component<MyProps> {}

    const addsString = <MyComponent propBooleanExplicit={true} propBooleanImplicit propNumber={0} propString="" />;
})();
