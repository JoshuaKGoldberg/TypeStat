# Development

Thanks for looking at TypeStat!
It's very new and I very much would appreciate your help.

Any issue marked as [accepting prs](https://github.com/JoshuaKGoldberg/TypeStat/issues?q=is%3Aissue+is%3Aopen+label%3A%22accepting+prs%22) on the issue tracker is fair game to take on.
Please do file issues if you find bugs or lacking features!

## Local Setup

After installing [Node >=10](https://nodejs.org/en/download) and [yarn](https://yarnpkg.com), clone and install packages locally with:

```shell
git clone https://github.com/joshuakgoldberg/typestat
cd typestat
yarn
```

Compile with `yarn run tsc`, lint with `yarn run lint`, and run tests with `yarn run test`.
Do all three with `yarn run verify`.

## Mutation Tests

Most TypeStat tests run TypeStat on checked-in files and are built on [`automutate-tests`](https://github.com/automutate/automutate-tests).
These tests are located under `test/cases`.

`yarn run test:mutation` may take in two parameters:

### `--accept`

Whether to override existing expected test results instead of asserting equality.
Tests can still fail if TypeStat throws an error, but not if the contents aren't equal.

```shell
yarn run test:mutation --accept
```

### `--include`

Regular expression filter(s) to include only some tests.
If not provided (the default), all tests are run.
If provided, only tests whose name matches one or more include filter will run.

Include filters are always prefixed and suffixed with `(.*)`, so you don't need to explicitly provide full test names.

For example, to run all tests with `variable` in their name:

```shell
yarn run test:mutation --include "noImplicitAny"
```

To run the `noImplicitAny/variableDeclarations` tests, either would work:

```shell
yarn run test:mutation --accept --include "noImplicitAny/variableDeclarations"
yarn run test:mutation --accept --include "mplicitAn.*variableDeclar"
```

### Debugging

VS Code tasks to debug test files is shipped that allows directly placing breakpoints in source TypeScript code.

* `Accept Current Mutation Test` runs with `--accept` on the test folder of a currently opened test file, such as an `original.ts` or `typestat.json`.
* `Debug Current Mutation Test` does not run with `--accept`, and thus logs any differences as errors.

#### Performance Debugging Tips

You can use the debugger in Chrome to debug TypeStat on the CLI.
Run it with `node --inspect` then visit `chrome://inspect` to use the browser debugger.

For example:

```shell
node --inspect typestat --config typestat.json
```
