(function () {
	class Name { }

	const stringsInferred = [''];
	stringsInferred.push('');

	const stringsExplicit: string[] = [];
	stringsExplicit.push('');

	const stringsMissing: string[] = [];
	stringsMissing.push('');

	let name = new Name();

	let names: Name[] = [];
	names.push(new Name());

	let uniqueNames: Set<Name> = new Set();
	uniqueNames.add(name);

	let namesById: Map<string, Name> = new Map();
	namesById.set('abc123', new Name())

	let idsByName: Map<Name, number> = new Map();
	idsByName.set(new Name(), 123);

	let uniqueMaybeNames: Set<number> = new Set();
	uniqueMaybeNames.add(Math.random() > 0.5 ? 123 : undefined)

	let uniqueNamesOrBooleans: Set<Name | boolean> = new Set();
	uniqueNamesOrBooleans.add(name);
	uniqueNamesOrBooleans.add(false);
})();
