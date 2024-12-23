// @ts-expect-error -- TODO: This module can only be default-imported using the 'esModuleInterop' flag
import React from "react";
// @ts-expect-error -- TODO: This module can only be default-imported using the 'esModuleInterop' flag
import PropTypes from "prop-types";

(function () {

interface MyComponentProps {
    boolRequired?: boolean;
}

	class MyComponent extends React.Component<MyComponentProps> {
		static propTypes = {
			boolRequired: PropTypes.bool.isRequired,
		};
	}
})();
