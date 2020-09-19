import React from "react";

(function() {
    interface MyProps {
        unused: boolean;
    }

    const UsesExternalProps = (props: MyProps) => {
        return "";
    }

    const jsx = <UsesExternalProps givenBoolean />;

    function DeclaresPropsWithPropTypes(props) {}

    DeclaresPropsWithPropTypes.propTypes = {
        declaredString: PropTypes.string,
    };

    interface NeverUsedComponentProps {
        value: number;
    }

    const NeverUsedComponent = (value: NeverUsedComponentProps) => value;
})();
