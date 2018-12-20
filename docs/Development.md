# Development

After installing [Node >=8](https://nodejs.org/en/download), clone and install packages locally with:

```shell
git clone https://github.com/joshuakgoldberg/typestat
cd typestat
npm i
```

Compile with `npm run tsc`, lint with `npm run lint`, and run tests with `npm run test`.
Do all three with `npm run verify`.

## Tests

TypeStat tests are built on [`automutate-tests`](https://github.com/automutate/automutate-tests).
These tests are located under `test/cases`.

`npm run test` may take in two parameters:

### `--accept`

Whether to override existing expected test results instead of asserting equality.
Tests can still fail if TypeStat throws an error, but not if the contents aren't equal.

```shell
npm run test -- --accept
```

### `--include`

Regular expression filter(s) to include only some tests.
If not provided (the default), all tests are run.
If provided, only tests whose name matches one or more include filter will run.

Include filters are always prefixed and suffixed with `(.*)`, so you don't need to explicitly provide full test names.

For example, to run all tests under `variables`:

```shell
npm run test -- --include "variables"
```

To run the `variables/all` tests, either would work:

```shell
npm run test -- --accept --include "variables/all"
npm run test -- --accept --include "variables(.*)all"
```

### Debugging

```shell
node --inspect C:\Code\typestat\bin\typestat src/**/*.test.ts --config typestat.json --project src/tsconfig.json --fixStrictNullChecks --fixIncompleteTypes
```