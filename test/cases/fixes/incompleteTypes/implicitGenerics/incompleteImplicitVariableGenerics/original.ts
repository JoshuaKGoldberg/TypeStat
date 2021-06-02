(function () {
    class Name { }

    const stringsInferred = [''];
    stringsInferred.push('');

    const stringsExplicit: string[] = [];
    stringsExplicit.push('');

    const stringsMissing = [];
    stringsMissing.push('');

    let name = new Name();

    let names = [];
    names.push(new Name());

    let uniqueNames = new Set();
    uniqueNames.add(name);

    let namesById = new Map();
    namesById.set('abc123', new Name())

    let idsByName = new Map();
    idsByName.set(new Name(), 123);

    let uniqueMaybeNames = new Set();
    uniqueMaybeNames.add(Math.random() > 0.5 ? 123 : undefined)

    let uniqueNamesOrBooleans = new Set();
    uniqueNamesOrBooleans.add(name);
    uniqueNamesOrBooleans.add(false);
})();
