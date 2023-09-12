(function () {
	function takesNumber(one) {}
	takesNumber(1);

	function takesStringThenBoolean(one, two) {}
	takesStringThenBoolean("abc", true);

	function takesStringOrBoolean(one) {}
	function passesStringOrBoolean(input: string | boolean) {
		takesStringOrBoolean(input);
	}

	function takesAny(input: any = {}) {}
})();
