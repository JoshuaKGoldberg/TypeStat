(function () {
	enum Value {
		A,
		B,
	}

	function withValue(value: string | Value) {}

	withValue(Value.A);
	withValue(Value.B);
})();
