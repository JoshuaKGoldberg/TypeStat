(function () {
	class WithMissingString {
		property;
	}
	new WithMissingString().property = "abc";

	class WithExplicitString {
		property: string;
	}
	new WithMissingString().property = "abc";

	class WithMissingStringOrNumber {
		property;
	}
	function setWithMissingStringOrNumber(
		instance: WithMissingStringOrNumber,
		value: string | number,
	) {
		instance.property = value;
	}

	class WithExplicitStringMissingNumber {
		property: string | number;
	}
	function setWithExplicitStringMissingNumber(
		instance: WithExplicitStringMissingNumber,
		value: string | number,
	) {
		instance.property = value;
	}

	class WithObjectProperty {
		member;

		method() {
			this.member = {
				key: true,
			};
		}
	}

	class WithIncompleteObjectProperty {
		member: string | { key: boolean; };

		method() {
			this.member = "";
			this.member = {
				key: true,
			};
		}
	}

	class WithIncompleteNestedObjectProperty {
		member: string | { middle: { deepKey: boolean; }; middleKey: number; };

		method() {
			this.member = "";
			this.member = {
				middle: {
					deepKey: true,
				},
				middleKey: 0,
			};
		}
	}

	class WithAny {
		property: any;
	}

	const withAny = new WithAny();
	withAny.property = "";

	class WithUnknown {
		property: string;
	}

	const withUnknown = new WithUnknown();
	withUnknown.property = "";

	class WithNever {
		property: string;
	}

	const withNever = new WithNever();
	withNever.property = "";
})();
