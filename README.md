# TypeStat

[![Circle CI](https://circleci.com/gh/JoshuaKGoldberg/TypeStat.svg?style=svg)](https://circleci.com/gh/JoshuaKGoldberg/TypeStat)
[![NPM version](https://badge.fury.io/js/typestat.svg)](http://badge.fury.io/js/typestat)
[![Join the chat at https://gitter.im/TypeStat/community](https://badges.gitter.im/TypeStat/community.svg)](https://gitter.im/TypeStat/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-14cc21.svg)

Adds TypeScript type annotations using static analysis.

> ⚡💀 **Danger**: new and experimental; use at your own risk! 💀⚡

## Why?

Type safety with TypeScript, especially when adding [`--noImplicitAny`](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html)
or [`--strictNullChecks`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html),
is wonderful but can be difficult to add to large pre-existing projects.
Converting from JavaScript to TypeScript or improving type annotations through hundreds or thousands of legacy files is tedious and time-consuming.

This package automagically adds those missing type annotations for you with configurable comment markers.
It can...

✨ Convert JavaScript files to TypeScript in a single bound!

✨ Add TypeScript types on files freshly converted from JavaScript to TypeScript!

✨ Fix `--noImplicitAny` across all your files with one command!

✨ Annotate missing `null`s and `undefined`s to get you started with `--strictNullChecks`!

Doing so can allow you to enable these stricter compiler flags for all code without changing the runtime of existing code.
Hooray!
💪

> 👉 Protip: also take a look at [TypeWiz](https://github.com/urish/typewiz)! 👈

## Installation

```shell
npm i -g typestat
```

TypeStat can be installed globally or as a project dependency via npm/yarn.

## CLI

```shell
typestat
```

This will use [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig)
to search for a `package.json` `"typestat"` property or configuration file such to read settings from.

You can run on only a subset of files by passing globs to the command:

```shell
typestat src/demo/*.ts src/utils/**/*.ts
```

For instructions on the types of changes you can run with Typestat, see:

1. **[Usage.md](./docs/Usage.md) for recommended steps to get started**
2. [Fixes.md](./docs/Fixes.md) for the type of fixes TypeStat will generate mutations for
3. [Types.md](./docs/Types.md) for configuring how to rename types or add comments in mutations
4. [Nodes.md](./docs/Nodes.md) for details on which parts of source files TypeStat will change and how
5. [Filters.md](./docs/Filters.md) for using [tsquery](https://github.com/phenomnomnominal/tsquery) to ignore sections of source files
6. [Custom Mutators.md](./docs/Custom%20Mutators.md) for including or creating custom mutators

### Basic Flags

#### `-c`/`--config`

Path to a TypeStat configuration file, if you'd like a custom path.

```shell
typestat --config typestat.custom.json
```

#### `include`

Glob patterns of file names to include.
You can specify these as arguments to the CLI and/or through your TypeStat configuration file.
CLI includes will replace any configuration file includes.

```shell
typestat ./src/**/*.ts
```

```json
{
    "include": [
        "./src/**/*.ts"
    ]
}
```

#### `-p`/`--project`

Path to a TypeScript project file, if you'd like a path other than `./tsconfig.json`.

```shell
typestat --project tsconfig.strict.json
```

```json
{
    "project": "tsconfig.strict.json"
}
```

If a relative project file path is provided, its absolute path will be resolved from `--packageDirectory`.

### Usage

More advanced flags can be provided for:

* [Files](./docs/Files.md)
  * `--fileAbove`/`files.above`
  * `--fileBelow`/`files.below`
  * `--fileConvertFileExtensions`/`files.convertFileExtensions`
* [Filters](./docs/Filters.md)
  * `--filter`/`filter`
* [Fixes](./docs/Fixes.md):
  * `--fixIncompleteTypes`/`fixes.incompleteTypes`
  * `--fixMissingProperties`/`fixes.missingProperties`
  * `--fixNoImplicitAny`/`fixes.noImplicitAny`
  * `--fixStrictNonNullAssertions`/`fixes.strictNonNullAssertions`
* [Package](./docs/Package.md):
  * `--packageDirectory`/`package.directory`
  * `--packageFile`/`package.file`
  * `--packageMissingTypes`/`package.missingTypes`
* [Types](./docs/Types.md):
  * `--typeAlias`/`types.aliases`
  * `--typeMatching`/`types.matching`
  * `--typeOnlyPrimitives`/`types.onlyPrimitives`
  * `--typeStrictNullChecks`/`types.strictNullChecks`

## Node

You can also run TypeStat via its JavaScript API:

```javascript
import { typeStat } from "typestat";

typeStat()
    .then(result => {
        if (result.succeeded) {
            console.log(`Successfully ran TypeStat.`);
        } else {
            console.error(`Failed running TypeStat: ${result.error}`);
        }
    });
```

`typeStat` can optionally take in an object with most CLI/configuration settings.
See [TypeStatArgv](./src/index.ts):

```javascript
await typeStat({
    config: "./typestat.custom.json",
});
```

```javascript
await typeStat({
    config: "./typestat.custom.json",
    fixIncompleteTypes: true,
    fixNoImplicitAny: true,
    fixStrictNonNullAssertions: true,
    mutators: ["my-custom-mutator"],
    project: "./tsconfig.custom.json",
});
```

## Development

See [Development.md](./docs/Development.md).
