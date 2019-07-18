# Enabling `--strictNullChecks`

Start off by running the default set of `strictNullCheck` fixes.
This will add `!`s as necessary to any locations that use nullable types unsafely.

## Preferring ! Assertions

For example, this configuration will add `!`s only to `*.test.ts` test files, such as with VS Code's [strict tests push](https://github.com/Microsoft/vscode/issues/65233):

```json
{
    "fixes": {
        "strictNonNullAssertions": true
    },
    "include": [
        "./src/**/*.test.ts"
    ],
    "types": {
        "strictNullChecks": true
    }
}
```

## Preferring `| null` and `| undefined` Unions

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
        "incompleteTypes": true
    },
    "types": {
        "matching": [
            "^(null|undefined)$"
        ],
        "onlyPrimitives": true,
        "strictNullChecks": true
    }
}
```

Many more places will need `!` assertions after parameters and properties are given the new nullable types.
Consider running the earlier `!` fixes on your test files first, _then_ running this on your source files.

> To clean up code after this set is applied, consider using the [`no-non-null-assertion` TSLint rule](http://palantir.github.io/tslint/rules/no-non-null-assertion)
> and its auto-fixer over time.
