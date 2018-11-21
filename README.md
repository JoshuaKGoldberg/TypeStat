# TypeUp

[![Build Status](https://travis-ci.org/joshuakgoldberg/TypeUp.svg?)](https://travis-ci.org/joshuakgoldberg/TypeUp)
[![NPM version](https://badge.fury.io/js/joshuakgoldberg.svg)](http://badge.fury.io/js/joshuakgoldberg)
[![Greenkeeper badge](https://badges.greenkeeper.io/joshuakgoldberg/TypeUp.svg)](https://greenkeeper.io/)

Helps older TypeScript code ease into `--strictNullChecks` by adding stricter type annotations.

> ⚡💀 **Danger**: new and experimental; use at your own risk! 💀⚡

## Why?

Stringent type safety such as [strict null checking](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html) in TypeScript
is wonderful but can be difficult to add to large pre-existing projects.
Adding the new type annotations through hundreds or thousands of legacy files is tedious and time-consuming.

This package automagically adds those missing type annotations for you with configurable comment markers.
That can allow you to enable these stricter compiler flags for all code without changing the runtime of existing code.

> Protip: also take a look at [TypeWiz](https://github.com/urish/typewiz)!

## Usage

```shell
npm i -g typeup
```

You'll need to have the `"strictNullChecks"` option enabled via a `tsconfig.json`, either directly or with the superset `"strict"`.

```json
{
    "compilerOptions": {
        "strictNullChecks": true
    }
}
```

### CLI

```shell
typeup
```

The `typeup` command uses [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to search for a `package.json` property or configuration file such as `typeup.json` for settings.

#### `-V`/`--version`

Run with `-V` or `--version` to print the package version.

```shell
typeup --version
```

### Node

```javascript
import { typeUp } from "typeup";

typeUp()
    .then(result => {
        if (result.succeeded) {
            console.log(`Successfully ran TypeUp.`);
        } else {
            console.error(`Failed running TypeUp: ${result.error}`);
        }
    });
```

`typeUp` can optionally take in a `{ config: string }` as an explicit configuration file path.

```javascript
await typeUp({
    config: "./typeup.custom.json",
});
```

## Options

All runtime options, such as for fixes or a `tsconfig.json` path, are expected to be in a `typeup.json` or [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig) equivalent.

See `RawTypeUpOptions` in [`src/options.ts`](./src/options.ts).

### `fixes`

The following fixers are all **on by default** can each be configured with a field in your configuration file underneath `"options"`.
Entries may be:

* `false` to disable the option
* `{ comment: "some-comment" }` for a different added comment string than the option name
* `{ comment: false }` to remove the comment string

For example, in a `typeup.json`:

```json
{
    "options": {
        "parameter-strictness": false,
        "property-strictness": {
            "comment": false
        },
        "return-strictness": {
            "comment": "TODO/property-strictness"
        },
    }
}
```

#### `parameter-strictness`

> ❌ Coming soon! ❌

Function parameter types should include `null` and/or `undefined` as necessary.
If a function is ever called a value allowing `null` or `undefined` for a parameter, those should be included in its type definition.
This will work for all function-like constructs with parameters in TypeScript, i.e. traditional `function`s and `() => {}` arrow lambdas.

```diff
- function abc(def: string) {
+ function abc(def: string | undefined /* parameter-strictness */) {
    return def === undefined ? "" : def;
}

def(undefined);
```

#### `property-strictness`

Class property types should include `null` and/or `undefined` as necessary.
If a property is ever assigned a value allowing `null` or `undefined`, those should be included in its type definition.

```diff
class Abc {
-   private def: string;
+   private def: string | undefined /* property-strictness */;

    public ghi(def: string | undefined) {
        this.def = def;
    }
}
```

#### `return-strictness`

Function return types should include `null` and/or `undefined` as necessary.
If a function can return a def allowing `null` or `undefined`, those should be included in its type definition.
This will work for all function-like constructs in TypeScript, including traditional `function`s, `() => {}` arrow lambdas, and `get`ters.

```diff
- function abc(def: boolean): string {
+ function abc(def: boolean): string | undefined /* return-strictness */ {
    return def ? "" : undefined;
}
```

#### `variable-strictness`

Variable types should include `null` and/or `undefined` as necessary.
If a variable is ever assigned a value allowing `null` or `undefined`, those should be included in its type definition.

```diff
- let abc: string = null;
+ let abc: string | null /* variable-strictness */ = null;
```

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

## Development

After installing [Node >=8](https://nodejs.org/en/download), clone and install packages locally with:

```shell
git clone https://github.com/joshuakgoldberg/typeup
cd typeup
npm i
```

Compile with `npm run tsc`, lint with `npm run lint`, and run tests with `npm run test`.
Do all three with `npm run verify`.

### Why Not TSLint?

Or: why isn't this implemented as a set of [TSLint](https://github.com/palantir/tslint) rules?

Great question!
TSLint rules, even with [type checking](https://palantir.github.io/tslint/usage/type-checking), don't have access to the full [TypeScript language service](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API).
This is by design for performance and reliability reasons.
TypeUp needs that service.

TSLint also has a [relatively unstable `--fix`](https://github.com/palantir/tslint/issues/2556) that can't handle multiple rounds of mutations.
TypeUp is built on [Automutate](https://github.com/automutate/automutate), which is more stable and allows multiple rounds.
