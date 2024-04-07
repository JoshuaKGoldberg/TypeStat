import * as React from "react";

(function () {
	interface MyComponentProps {
		text: string;
	}

	const MyComponent: React.FC<MyComponentProps> = ({ text }) => {
		return <span>{text}</span>;
	};
})();
