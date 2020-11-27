(function () {
    class Name { }

    let name = new Name();

    let names = [];
    names.push(new Name());

    let uniqueNames = new Set();
    uniqueNames.add(name);

    let namesById = new Map();
    namesById.set('abc123', new Name())

    let idsByName = new Map();
    idsByName.set(new Name(), 123);

    // TODO: fix me :)
    let uniqueMaybeNames = new Set();
    uniqueMaybeNames.add(idsByName.get(123));

    let uniqueNamesOrBooleans = new Set();
    uniqueNamesOrBooleans.add(name);
    uniqueNamesOrBooleans.add(false);
})();
