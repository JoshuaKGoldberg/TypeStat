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

Most TypeStat tests run TypeStat on checked-in files and are use snapshot testing for output.
These tests are located under `test/cases`.

[Vitest](https://vitest.dev) is also used for these tests.
To accept new snapshots, you can use [Vitest's snapshot updates](https://vitest.dev/guide/snapshot#updating-snapshots):

```shell
pnpm run test:mutation --update
```

#### Debugging Mutation Tests

VS Code tasks to debug test files is shipped that allows directly placing breakpoints in source TypeScript code.

- `Accept Current Mutation Test` runs with `-u`/`--update` on the test folder of a currently opened test file, such as an `original.ts` or `typestat.json` to update its snapshot.
- `Debug Current Test File` does not run with `-u`/`--update`, and thus treats any differences as test failures.

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
