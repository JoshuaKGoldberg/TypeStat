(function () {
	enum Value {
		A,
		B,
	}

	function withValue(value: string) {}

	withValue(Value.A);
	withValue(Value.B);
})();
