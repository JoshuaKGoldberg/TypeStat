# Package

An optional set of CLI flags and/or configuration object fields containing package-level changes to make outside of mutations.

```json
{
    "package": {
        "directory": "../MyRepo",
        "file": "./node/package.json",
        "missingTypes": "yarn"
    }
}
```

## `directory`

```json
{
    "package": {
        "directory": "../MyRepo"
    }
}
```

Base directory to resolve paths from.
All non-absolute paths within all settings except `-c`/`--config` will be resolved against this directory.

## `file`

```json
{
    "package": {
        "file": "./node/package.json"
    }
}
```

File path to a `package.json` to consider the project's package file.
If not provided, defaults to `./package.json`.

If `package.file` is relative, `package.directory` will be used as a root path to resolve from.

## `missingTypes`

```json
{
    "package": {
        "missingTypes": true
    }
}
```

Package manager to install missing types, if not `true` to auto-detect or `undefined` to not.
If this is provided, for any `require` or `import` to an absolute path that doesn't have its corresponding [`@types/`](https://github.com/DefinitelyTyped/DefinitelyTyped) package,
that package will be installed.

For example, if the following code exists in any file within the TypeScript project:

```javascript
import { array } from "lodash/array";
```

TypeStat will attempt to install `@types/lodash` unless it's already any form of dependency in the `package.file`,

### Package Manager Configuration

This field has four potential allowed configurations:

* `false` _(default)_: skip installing missing packages
* `true`: auto-detect whether to use Yarn _(if a `yarn.lock` exists)_ or npm _(default)_

    ```json
    {
        "package": {
            "missingTypes": true
        }
    }
    ```

* `"npm"`: install using npm

    ```json
    {
        "package": {
            "missingTypes": "npm"
        }
    }
    ```

* `"yarn"`: install using Yarn

    ```json
    {
        "package": {
            "missingTypes": "yarn"
        }
    }
    ```

### Node types

`@types/node` will be installed in any of the following cases:

* `module =`, `module.exports =`, or `module.exports.*` = statement(s) exist
* [Built-in modules](https://www.npmjs.com/package/builtin-modules) are imported from
* A global [`process` object](https://nodejs.org/api/process.html#process_process) is referenced
