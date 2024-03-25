# Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo) and [installing pnpm](https://pnpm.io):

```shell
git clone https://github.com/<your-name-here>/TypeStat
cd TypeStat
pnpm
```

> This repository includes a list of suggested VS Code extensions.
> It's a good idea to use [VS Code](https://code.visualstudio.com) and accept its suggestion to install them, as they'll help with development.

## Building

Run [**tsup**](https://tsup.egoist.dev) locally to build source files from `src/` into output files in `lib/`:

```shell
pnpm build
```

Add `--watch` to run the builder in a watch mode that continuously cleans and recreates `lib/` as you save files:

```shell
pnpm build --watch
```

## Formatting

[Prettier](https://prettier.io) is used to format code.
It should be applied automatically when you save files in VS Code or make a Git commit.

To manually reformat all files, you can run:

```shell
pnpm format --write
```

## Linting

[ESLint](https://eslint.org) is used with with [typescript-eslint](https://typescript-eslint.io)) to lint JavaScript and TypeScript source files.
You can run it locally on the command-line:

```shell
pnpm run lint
```

ESLint can be run with `--fix` to auto-fix some lint rule complaints:

```shell
pnpm run lint --fix
```

Note that you'll likely need to run `pnpm build` before `pnpm lint` so that lint rules which check the file system can pick up on any built files.

## Testing

There are two kinds of tests:

- [Unit tests](#unit-tests)
- [Mutation tests](#mutation-tests)

### Unit TEsts

[Vitest](https://vitest.dev) is used for tests.
You can run it locally on the command-line:

```shell
pnpm run test
```

Add the `--coverage` flag to compute test coverage and place reports in the `coverage/` directory:

```shell
pnpm run test --coverage
```

Note that [console-fail-test](https://github.com/JoshuaKGoldberg/console-fail-test) is enabled for all test runs.
Calls to `console.log`, `console.warn`, and other console methods will cause a test to fail.

#### Debugging Unit Tests

This repository includes a [VS Code launch configuration](https://code.visualstudio.com/docs/editor/debugging) for debugging unit tests.
To launch it, open a test file, then run _Debug Current Test File_ from the VS Code Debug panel (or press F5).

### Mutation Tests

Most TypeStat tests run TypeStat on checked-in files and are built on [`automutate-tests`](https://github.com/automutate/automutate-tests).
These tests are located under `test/cases`.

`pnpm run test:mutation` may take in two parameters:

#### `--accept`

Whether to override existing expected test results instead of asserting equality.
Tests can still fail if TypeStat throws an error, but not if the contents aren't equal.

```shell
pnpm run test:mutation --accept
```

#### `--include`

Regular expression filter(s) to include only some tests.
If not provided (the default), all tests are run.
If provided, only tests whose name matches one or more include filter will run.

Include filters are always prefixed and suffixed with `(.*)`, so you don't need to explicitly provide full test names.

For example, to run all tests with `variable` in their name:

```shell
pnpm run test:mutation --include "noImplicitAny"
```

To run the `noImplicitAny/variableDeclarations` tests, either would work:

```shell
pnpm run test:mutation --accept --include "noImplicitAny/variableDeclarations"
pnpm run test:mutation --accept --include "ImplicitAn.*variableDeclaration"
```

#### Debugging Mutation Tests

VS Code tasks to debug test files is shipped that allows directly placing breakpoints in source TypeScript code.

- `Accept Current Mutation Test` runs with `--accept` on the test folder of a currently opened test file, such as an `original.ts` or `typestat.json`.
- `Debug Current Mutation Test` does not run with `--accept`, and thus logs any differences as errors.

## Performance Debugging Tips

You can use the debugger in Chrome to debug TypeStat on the CLI.
Run it with `node --inspect` then visit `chrome://inspect` to use the browser debugger.

For example:

```shell
node --inspect typestat --config typestat.json
```

## Type Checking

You should be able to see suggestions from [TypeScript](https://typescriptlang.org) in your editor for all open files.

However, it can be useful to run the TypeScript command-line (`tsc`) to type check all files in `src/`:

```shell
pnpm tsc
```

Add `--watch` to keep the type checker running in a watch mode that updates the display as you save files:

```shell
pnpm tsc --watch
```
