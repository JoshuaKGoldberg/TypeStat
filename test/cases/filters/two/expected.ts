(function () {
	class Foo {
		public value: number = 3;

		// the return type of this function should not be updated
		dispose() {
// @ts-expect-error -- TODO: Type 'null' is not assignable to type 'number'.
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
// @ts-expect-error -- TODO: Type 'null' is not assignable to type 'Foo'.
		foo = null;
	});
})();
