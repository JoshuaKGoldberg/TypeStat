# Custom Mutators

TypeStat allows using custom mutators instead of the built-in mutators, similar to [custom ESLint rules](https://eslint.org/docs/developer-guide/working-with-rules).
Built-in mutators will be disabled if you provide any custom ones.

## Usage

Use the `-m`/`--mutators` CLI flag and/or `mutators` configuration setting to add `require`-style paths of mutators to add.

```json
{
	"mutators": ["my-mutator-module"]
}
```

These will be run in order of inclusion, starting with mutators specified on the CLI.

## Development

In order to create a custom mutator included by an added path, that added path must resolve from Node's `require` to a file that exports a `.mutator` function.

That `mutator` will receive a single `request` parameter of type [`FileMutationsRequest`](../src/mutators/fileMutator).
It should return an array of Automutate `Mutation` objects.

For example, if you run `typestat --add ./src/mutators/myMutator`, there should exist a `./src/mutators/myMutator.js` file _(or `./src/mutators/myMutator/index.js`)_:

```typescript
import { Mutation } from "automutate";
import { FileMutationsRequest } from "typestat";

export const mutator = (request: FileMutationsRequest): Mutation[] => {
	// TODO: Implement!
	return [];
};
```

Mutators must be compiled to JavaScript to be run.

For example, this mutator will add a `/* foo */` mutation at the beginning of each file it visits, if one doesn't yet exist in the file:

```js
const prefix = "/* foo */ ";

module.exports.fileMutator = (request) => {
	return request.sourceFile.getFullText().startsWith(prefix)
		? []
		: [
				{
					insertion: prefix,
					range: {
						begin: 0,
					},
					type: "text-insert",
				},
			];
};
```
