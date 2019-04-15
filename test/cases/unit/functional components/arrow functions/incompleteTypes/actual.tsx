import React from "react";

(function() {
    interface MyProps {
        unused: boolean;
    }

    const UsesExternalProps = (props: MyProps) => {
        return "";
    }

    const jsx = <UsesExternalProps givenBoolean />;

interface DeclaresPropsWithPropTypesProps {
    declaredString?: string;
}


    function DeclaresPropsWithPropTypes(props) {}

    DeclaresPropsWithPropTypes.propTypes = {
        declaredString: PropTypes.string,
    };
})();
