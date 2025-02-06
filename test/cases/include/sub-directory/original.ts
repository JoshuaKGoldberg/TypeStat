import { A } from "./code/import";

(function () {
	//T his test makes sure that includes that are not globs, are actually included.
	console.log("Hello, world!");

	function ignoreChanges(): string {
		return A;
	}
})();
