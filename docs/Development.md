# Development

Thanks for looking at TypeStat!
It's very new and I very much would appreciate your help.

Any issue marked as [accepting prs](https://github.com/JoshuaKGoldberg/TypeStat/issues?q=is%3Aissue+is%3Aopen+label%3A%22accepting+prs%22) on the issue tracker is fair game to take on.

Please do file issues if you find bugs or lacking features!

## Local Setup

After installing [Node >=8](https://nodejs.org/en/download) and [yarn](https://yarnpkg.com), clone and install packages locally with:

```shell
git clone https://github.com/joshuakgoldberg/typestat
cd typestat
yarn
```

Compile with `yarn run tsc`, lint with `yarn run lint`, and run tests with `yarn run test`.
Do all three with `yarn run verify`.

## Mutation Tests

TypeStat tests are built on [`automutate-tests`](https://github.com/automutate/automutate-tests).
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

For example, to run all tests under `variables`:

```shell
yarn run test:mutation --include "variables"
```

To run the `variables/all` tests, either would work:

```shell
yarn run test:mutation --accept --include "variables/all"
yarn run test:mutation --accept --include "variables(.*)all"
```

### Debugging

A VS Code task to debug test files is shipped that allows directly placing breakpoints in source TypeScript code.
Modify the `includes` statement in `runTests.ts` to only debug some tests.

#### Performance Debugging Tips

You can use the debugger in Chrome to debug TypeStat on the CLI.
Run it with `node --inspect` then visit `chrome://inspect` to use the browser debugger.

For example:

```shell
node --inspect typestat --config typestat.json
```
