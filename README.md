# TypeStat

[![Build Status](https://travis-ci.org/joshuakgoldberg/TypeStat.svg?)](https://travis-ci.org/joshuakgoldberg/TypeStat)
[![NPM version](https://badge.fury.io/js/joshuakgoldberg.svg)](http://badge.fury.io/js/joshuakgoldberg)
[![Greenkeeper badge](https://badges.greenkeeper.io/joshuakgoldberg/TypeStat.svg)](https://greenkeeper.io/)

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

For documentation on the types of fixes TypeStat applies, see [Fixes.md](./docs/Fixes.md).

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
to search for a `package.json` `"typestat"` property or configuration file such as `typestat.json` to use settings from.

You can run on only a subset of files by passing globs to the command:

```shell
typestat src/demo/*.ts src/utils/**/*.ts
```

### Flags

#### `-c`/`--config`

Path to a TypeStat configuration file, if you'd like a custom path.

```shell
typestat --config typestat.custom.json
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

#### `-V`/`--version`

Run with `-V` or `--version` to print the package version.

```shell
typestat --version
```

### Fixes

An optional set of CLI flags or configuration object containing which fixes (type additions) are enabled.

Each fixer can be configured to suggest no, some, or all forms of type modifications.
These all default to `false` but can be enabled by being set to `true`.

```json
{
    "fixes": {
        "incompleteTypes": true,
        "noImplicitAny": true,
        "noImplicitThis": true,
        "strictNullChecks": true
    }
}
```

See [Fixes.md](./docs/Fixes.md) for more details on these fixes.

### `--fixNoImplicitAny`/`noImplicitAny`

```shell
typestat --fixNoImplicitAny
```

```json
{
    "fixes": {
        "noImplicitAny": true
    }
}
```

Whether to add type annotations to types that don't yet have them.
This entirely relies on TypeScript's suggested fixes to infer types from usage.

Places that don't need added types (i.e. would violate [`no-unnecessary-type-annotation`](https://github.com/ajafff/tslint-consistent-codestyle/blob/master/docs/no-unnecessary-type-annotation.md))
won't have them added.

<!--
### `--fixNoImplicitThis`/`noImplicitThis`

```shell
typestat --fixNoImplicitThis
```

```json
{
    "fixes": {
        "noImplicitThis": true
    }
}
```

> ❌ Coming soon! ❌
>
> Blocked on https://github.com/Microsoft/TypeScript/issues/28964.
-->

### `--fixStrictNullChecks`/`strictNullChecks`

```shell
typestat --fixStrictNullChecks
```

```json
{
    "fixes": {
        "strictNullChecks": true
    }
}
```

Whether to add `| null` and `| undefined` types when constructs can be assigned them but aren't.
Useful if your project is already fully onboarded onto `--noImplicitAny` but not `--strictNullChecks`.

#### `--fixIncompleteTypes`/`incompleteTypes`

```shell
typestat --fixIncompleteTypes
```

```json
{
    "fixes": {
        "incompleteTypes": true
    }
}
```

Whether to augment type annotations that don't capture all values constructs can be set to.

This typically isn't useful on its own _(unless you have many incorrect types)_,
but is powerful along with `noImplicitAny` and/or `strictNullChecks` to fix existing codebases for the stricter compiler flags.

### `typeAliases`

Object mapping names of added types to strings to replace them with.

For example, to replace `null` with `null /* TODO: check auto-generated types (thanks TypeStat!) */`:

```json
{
    "typeAliases": {
        "null": "null /* TODO: check added types (thanks TypeStat!) */"
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
