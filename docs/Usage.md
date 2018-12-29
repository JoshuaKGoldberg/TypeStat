# Usage

Generally speaking, TypeStat should be used as a bandaid on top of existing code.
Meaning: TypeStat will perform the least amount of work possible to satisfy the type system.
The built-in mutators will only ever add or remove types and will never change your runtime behavior.

There are several purposes you could apply TypeStat for and a plethora of unfortunately confusing options behind them.
Each section in this page is a different suggested way to use it.

You'll need to tailor TypeStat's settings for your project.
Read through these examples first to see which forms might work best for your code.
Reach out on [Gitter](https://gitter.im/JoshuaKGoldberg/TypeStat) or [Twitter](https://twitter.com/JoshuaKGoldberg) if you want help!

> Most uses are still in development and not ready for use, but they'll be added here once they are.

Each example shows both the CLI usage and configuration file usage.
You can use either.

## Enabling `--strictNullChecks`

Start off by running the default set of `strictNullCheck` fixes.
This will add `!`s as necessary to any locations that use nullable types unsafely.

### Preferring ! Assertions

For example, this configuration will add `!`s only to `*.test.ts` test files, such as with VS Code's [strict tests push](https://github.com/Microsoft/vscode/issues/65233):

```shell
typestat --fixStrictNullChecks ./src/**/*.test.ts
```

```json
{
    "fixes": {
        "strictNullChecks": true
    },
    "include": [
        "./src/**/*.test.ts"
    ]
}
```

### Preferring `| null` and `| undefined` Unions

Alternately, you can enable the `incompleteTypes` fix, which will prefer adding `| null` and `| undefined` to types as properties, parameters, and so on.
This configuration will add those with:

* `filters` to ignore class and test disposal methods, as they might assign `null` or `undefined` unnecessarily
* `types.matching` to only add `null` and `undefined` as types
* `types.onlyPrimitives` to skip computing advanced types as a performance improvement

```json
{
    "filters": [
        "CallExpression[expression.text=suiteTeardown]",
        "CallExpression[expression.text=teardown]",
        "MethodDeclaration[name.text=dispose]"
    ],
    "fixes": {
        "incompleteTypes": true,
        "strictNullChecks": true
    },
    "types": {
        "matching": [
            "^(null|undefined)$"
        ],
        "onlyPrimitives": true
    }
}
```

This will also add `!` assertions everywhere.
Many more places will need them after parameters and properties are given the new nullable types.

> To clean up code after this set is applied, consider using the [`no-non-null-assertion` TSLint rule](http://palantir.github.io/tslint/rules/no-non-null-assertion)
> and its auto-fixer over time.

## Converting Classes from JavaScript to TypeScript

Converting classes from JavaScript to TypeScript tends to be one of the more painful parts of conversions,
since classes in TypeScript need to have member properties declared.

TypeScript provides a feature to infer and add those properties.
Use `--fixMissingProperties`/`fixes.missingProperties` to apply those mutations across all files:

```shell
typestat --fixMissingProperties
```

```json
{
    "fixes": {
        "missingProperties": true
    }
}
```
