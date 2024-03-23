import { ComponentLike } from './react-like';

(function () {
	// Straightforward generics

	class BaseWithoutGenerics { }
	class BaseWithOneGeneric<T> { constructor(t: T | OneInterface | OneType | string) { } }
	class BaseWithTwoGenerics<T, U> {constructor(t: T | number, u: U | boolean) {} }

	class ExtendsBaseWithout extends BaseWithoutGenerics { }
	new ExtendsBaseWithout();


	class ExtendsBaseWithOneLiteral extends BaseWithOneGeneric<string> {
		constructor() {
			super('abc')
		}
	}

	interface OneInterface {
		property: string;
	}
	const oneInterface: OneInterface = { property: 'abc' };


	class ExtendsBaseWithOneInterface extends BaseWithOneGeneric<OneInterface> {
		constructor() {
			super(oneInterface)
		}
	}

	type OneType = {
		property: string[];
	}
	const oneType: OneType = { property: ['a', 'b', 'c'] };


	class ExtendsBaseWithOneType extends BaseWithOneGeneric<OneType> {
		constructor() {
			super(oneType)
		}
	}


	class ExtendsBaseWithTwo extends BaseWithTwoGenerics<number, boolean> {
		constructor() {
			super(123, false)
		}
	}

	// Member object (e.g. for React state)

	class MemberImmediateBase<First = {}, Second = {}> {
		member: Second;

		setMember(member: Second) {
			return member;
		}
	}


	class MemberImmediate extends MemberImmediateBase<{}, { key: boolean; }> {
		member = {
			key: false,
		};

		addToState = () => {
			this.setMember({ key: true });
		};
	}


	class MemberImmediateFunction extends MemberImmediateBase<{}, { key: (arg0: boolean) => void; }> {
		member = {
			key: (arg0: boolean) => {}
		};

		addToState = () => {
			this.setMember({ key: (arg0: boolean) => {} });
		};
	}

	class MemberCurriedBase<First = {}> {
		member: First;

		setMember(getMember: (oldMember: First) => First) {
			getMember(this.member);
		}
	}

	interface MemberAndType {
		key: boolean;
	}


	class MemberCurriedWithMemberAndType extends MemberCurriedBase<MemberAndType> {
		member: MemberAndType;

		addToState = () => {
			this.setMember(previousMember => ({
				key: !previousMember.key,
			}));
		};
	}


	class MemberCurriedWithMember extends MemberCurriedBase<{ key: boolean; }> {
		member = {
			key: false,
		};

		addToState = () => {
			this.setMember(previousMember => ({
				key: !previousMember.key,
			}));
		};
	}
})();
