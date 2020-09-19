import React from "react";

(function() {
    interface MyProps {
        unused: boolean;
propBooleanExplicit?: boolean;
propBooleanImplicit?: boolean;
propNumber?: number;
propString?: string;
    }

    class MyComponent extends React.Component<MyProps> {}

    const addsString = <MyComponent
        propBooleanExplicit={true}
        propBooleanImplicit
        propNumber={0}
        propString=""
    />;
})();
