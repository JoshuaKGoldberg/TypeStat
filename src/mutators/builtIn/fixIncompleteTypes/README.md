# `--fixIncompleteTypes`/`incompleteTypes`

Whether to augment type annotations that don't capture all values constructs can be set to.

This is particularly useful if:

* You're converting from JavaScript to TypeScript and fixing for `noImplicitAny`
* You're converting from JavaScript to TypeScript and adding React component types
* You have many existing incorrect types per `strictNullChecks`

For example, if a variable is typed as a `number` but is also assigned a `string`, this would change its type to `number | string`:

```diff
- let abc: number = "";
+ let abc: number | string = "";

abc = 7;
```

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

## Sub-Fixers

* [`fixIncompleteParameterTypes`](./fixIncompleteParameterTypes/README.md)
* [`fixIncompletePropertyDeclarationTypes`](./fixIncompletePropertyDeclarationTypes/README.md)
* [`fixIncompleteReactTypes`](./fixIncompleteReactTypes/README.md)
* [`fixIncompleteReturnTypes`](./fixIncompleteReturnTypes/README.md)
* [`fixIncompleteVariableTypes`](./fixIncompleteVariableTypes/README.md)
