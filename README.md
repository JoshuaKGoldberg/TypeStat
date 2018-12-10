# TypeStat

[![Build Status](https://travis-ci.org/joshuakgoldberg/TypeStat.svg?)](https://travis-ci.org/joshuakgoldberg/TypeStat)
[![NPM version](https://badge.fury.io/js/joshuakgoldberg.svg)](http://badge.fury.io/js/joshuakgoldberg)
[![Greenkeeper badge](https://badges.greenkeeper.io/joshuakgoldberg/TypeStat.svg)](https://greenkeeper.io/)

Adds JSDoc and/or TypeScript type annotations using static analysis.

> ⚡💀 **Danger**: new and experimental; use at your own risk! 💀⚡

## Why?

Stringent type safety with TypeScript, especially when adding [`--noImplicitAny`](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html)
or [`--strictNullChecks`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html),
is wonderful but can be difficult to add to large pre-existing projects.
Even proper JSDoc coverage is difficult to achieve on more than a few dozen files.
Adding type annotations through hundreds or thousands of legacy files is tedious and time-consuming.

This package automagically adds those missing type annotations for you with configurable comment markers.
It can add...

✨ TypeScript types on files freshly converted from JavaScript to TypeScript!

✨ Fixes for `--noImplicitAny` across all your files with one command!

✨ Missing `null`s and `undefined`s to get you started with `--strictNullChecks`!

Doing so can allow you to enable these stricter compiler flags for all code without changing the runtime of existing code.

For documentation on the types of fixes TypeStat applies, see [Fixes.md](./docs/Fixes.md).

> 👉 Protip: also take a look at [TypeWiz](https://github.com/urish/typewiz)! 👈

## Usage

Install TypeStat globally:

```shell
npm i -g typestat
```

...then create a `typestat.json` file in your project directory:

```json
{
    "fixes": {
        "noImplicitAny": true
    }
}
```

See [Fixes.md](./docs/Fixes.md) for configuring these fixes.

### CLI

```shell
typestat
```

The `typestat` command uses [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig)
to search for a `package.json` property or configuration file such as `typestat.json` for settings.

#### `-c`/`--config`

Path to a config file, if you'd like a custom path.

```shell
typestat --config typestat.custom.json
```

#### `-V`/`--version`

Run with `-V` or `--version` to print the package version.

```shell
typestat --version
```

## Options

All runtime options, such as `fixes` or a `tsconfig.json` path, are expected to be in a `typestat.json` or [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig) equivalent.

See `RawTypeStatOptions` in [`src/options/types.ts`](./src/options/types.ts).

### `fixes`

An optional object containing which fixes (type additions) are enabled.

See [Fixes.md](./docs/Fixes.md) for configuring these fixes.

### `include`

Globs of files to run on, if not everything in the TypeScript project.
Useful to only change some files at a time.

```json
{
    "include": [
        "src/experimental/**/*.ts"
    ]
}
```

### `projectPath`

Relative path to a TypeScript project.
Defaults to `"tsconfig.json"`.

```json
{
    "projectPath": "./tsconfig.custom.json"
}
```

### `typeAliases`

Object mapping names of added types to strings to replace them with.

For example, to replace `null` with `null /* TODO: check auto-generated types (thanks TypeStat!) */`:

```json
{
    "typeAliases": {
        "null": "null /* TODO: check auto-added types (thanks TypeStat!) */"
    }
}
```

One strategy is to create a global type alias in your code for each migration to make it _really_ clear these are temporary
_(and easier to find-all in your IDE)_:

```typescript
// typings.d.ts
type TodoAutoAddedUndefined = undefined;
```

```json
{
    "typeAliases": {
        "undefined": "TodoAutoAddedUndefined"
    }
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

`typeStat` can optionally take in a `{ config: string }` as an explicit configuration file path.

```javascript
await typeStat({
    config: "./typestat.custom.json",
});
```

## Development

After installing [Node >=8](https://nodejs.org/en/download), clone and install packages locally with:

```shell
git clone https://github.com/joshuakgoldberg/typestat
cd typestat
npm i
```

Compile with `npm run tsc`, lint with `npm run lint`, and run tests with `npm run test`.
Do all three with `npm run verify`.

### Why Not TSLint?

Or: why isn't this implemented as a set of [TSLint](https://github.com/palantir/tslint) rules?

Great question!
TSLint rules, even with [type checking](https://palantir.github.io/tslint/usage/type-checking), don't have access to the full [TypeScript language service](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API).
This is by design for performance and reliability reasons.
TypeStat needs that service.

TSLint also has a [relatively unstable `--fix`](https://github.com/palantir/tslint/issues/2556) that can't handle multiple rounds of mutations.
TypeStat is built on [Automutate](https://github.com/automutate/automutate), which is more stable and allows multiple rounds.
