# TypeStat

[![Build Status](https://travis-ci.org/JoshuaKGoldberg/TypeStat.svg?)](https://travis-ci.org/JoshuaKGoldberg/TypeStat)
[![NPM version](https://badge.fury.io/js/typestat.svg)](http://badge.fury.io/js/typestat)
![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

Adds TypeScript type annotations using static analysis.

> ⚡💀 **Danger**: new and experimental; use at your own risk! 💀⚡

## Why?

Stringent type safety with TypeScript, especially when adding [`--noImplicitAny`](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html)
or [`--strictNullChecks`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html),
is wonderful but can be difficult to add to large pre-existing projects.
Adding type annotations through hundreds or thousands of legacy files is tedious and time-consuming.

This package automagically adds those missing type annotations for you with configurable comment markers.
It can add...

✨ TypeScript types on files freshly converted from JavaScript to TypeScript!

✨ Fixes for `--noImplicitAny` across all your files with one command!

✨ Missing `null`s and `undefined`s to get you started with `--strictNullChecks`!

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
4. [Filters.md](./docs/Filters.md) for using [tsquery](https://github.com/phenomnomnominal/tsquery) to ignore sections of source files
5. [Custom Mutators.md](./docs/Custom%20Mutators.md) for including or creating custom mutators

### Basic Flags

#### `-c`/`--config`

Path to a TypeStat configuration file, if you'd like a custom path.

```shell
typestat --config typestat.custom.json
```

#### `include`

Glob patterns of file names to include.
You can either specify these as arguments to the CLI and/or through your TypeStat configuration file.
CLI icludes will replace any configuration file includes.

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
    add: ["my-custom-mutator"],
    config: "./typestat.custom.json",
    fixIncompleteTypes: true,
    fixNoImplicitAny: true,
    fixStrictNullChecks: true,
    project: "./tsconfig.custom.json",
});
```
