(function () {
	class Foo {
		public value: number = 3;

		dispose() {
			this.value = null;
		}
	}

	function teardown(action: () => void) {
		action();
	}

	let foo = new Foo();

	foo.value = 1;

	teardown(() => {
		foo = null;
	});
})();
