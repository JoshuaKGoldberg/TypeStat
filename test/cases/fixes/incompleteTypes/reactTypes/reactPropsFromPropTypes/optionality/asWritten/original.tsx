import React from "react";
import PropTypes from "prop-types";

(function() {
    class MyComponent extends React.Component {
        static propTypes = {
            boolRequired: PropTypes.bool.isRequired,
        };
    }
})();