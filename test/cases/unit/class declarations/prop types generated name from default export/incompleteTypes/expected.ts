import React from "react";
import PropTypes from "prop-types";

(function() {

interface ActualProps {
    number?: number;
}

    export default class extends React.Component<ActualProps> {
        static propTypes = {
            number: PropTypes.number,
        };

        render() {
            return "";
        }
    }
})();
