(function () {
	interface Shape {
		value?: unknown;
	}

	[].reduce<Shape>(() => ({}), {});
})();
