(function () {
    class Name { }

    let name = new Name();

    let names: { length: number, toString: Array, toLocaleString: Array, pop: Array, push: Array, concat: {  }, join: Array, reverse: Array, shift: Array, slice: Array, sort: Array, splice: {  }, unshift: Array, indexOf: Array, lastIndexOf: Array, every: {  }, some: Array, forEach: Array, map: Array, filter: {  }, reduce: {  }, reduceRight: {  }, find: {  }, findIndex: Array, fill: Array, copyWithin: Array, __@iterator: Array, entries: Array, keys: Array, values: Array, __@unscopables: Array, includes: Array }<{  }> = [];
    names.push(new Name());

    let uniqueNames: { add: Set, clear: Set, delete: Set, forEach: Set, has: Set, size: number, __@iterator: Set, entries: Set, keys: Set, values: Set, __@toStringTag: string }<{  }> = new Set();
    uniqueNames.add(name);

    let namesById: { clear: Map, delete: Map, forEach: Map, get: Map, has: Map, set: Map, size: number, __@iterator: Map, entries: Map, keys: Map, values: Map, __@toStringTag: string }<string, {  }> = new Map();
    namesById.set('abc123', new Name())

    let idsByName: { clear: Map, delete: Map, forEach: Map, get: Map, has: Map, set: Map, size: number, __@iterator: Map, entries: Map, keys: Map, values: Map, __@toStringTag: string }<{  }, number> = new Map();
    idsByName.set(new Name(), 123);

    // TODO: fix me :)
    let uniqueMaybeNames: { add: Set, clear: Set, delete: Set, forEach: Set, has: Set, size: number, __@iterator: Set, entries: Set, keys: Set, values: Set, __@toStringTag: string }<> = new Set();
    uniqueMaybeNames.add(idsByName.get(123));

    let uniqueNamesOrBooleans: { add: Set, clear: Set, delete: Set, forEach: Set, has: Set, size: number, __@iterator: Set, entries: Set, keys: Set, values: Set, __@toStringTag: string }<{  } | boolean> = new Set();
    uniqueNamesOrBooleans.add(name);
    uniqueNamesOrBooleans.add(false);
})();
