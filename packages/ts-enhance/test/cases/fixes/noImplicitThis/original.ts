// These would normally be wrapped in an IIFE, but:
// https://github.com/microsoft/TypeScript/issues/36309

export interface NoImplicitThisContainer {
	member: string;
	returnThisMember: () => string;
}

function returnThisMember() {
	return this.member;
}

const container: NoImplicitThisContainer = {
	member: "sample",
	returnThisMember: returnThisMember,
};

container.returnThisMember();
