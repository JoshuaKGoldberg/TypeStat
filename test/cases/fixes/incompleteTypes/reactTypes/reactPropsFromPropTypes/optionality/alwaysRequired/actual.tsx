import React from "react";
import PropTypes from "prop-types";

(function() {

interface MyComponentProps {
    boolRequired: boolean;
}

	class MyComponent extends React.Component<MyComponentProps> {
		static propTypes = {
			boolRequired: PropTypes.bool.isRequired,
		};
	}
})();