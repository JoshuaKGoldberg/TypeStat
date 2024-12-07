(function () {
	class Foo {
		public value: number = 3;

		// the return type of this function should not be updated
		dispose() {
			this.value = null;
		}
	}

	function teardown(action: () => void) {
		action();
	}

	let foo = new Foo();

	foo.value = 1;

	// the return type of this function should not be updated
	teardown(() => {
		foo = null;
	});
})();
