# Types

## `aliases`

Object mapping names of added types to strings to replace them with.

For example, to replace `null` with `null /* TODO: check auto-generated types (thanks TypeStat!) */`:

```json
{
    "types": {
        "aliases": {
            "null": "null /* TODO: check added types (thanks TypeStat!) */"
        }
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
    "types": {
        "aliases": {
            "undefined": "TodoAutoAddedUndefined"
        }
    }
}
```

## `--typesMatching`/`matching`

Regular expression matchers added types must match.
If one or more of these are provided, any added type must match at least one of them.

For example, either will only allow `null` or `undefined` as added types:

```shell
typestat --typesMatching "^null$" --typesMatching "^undefined$"
```

```json
{
    "types": {
        "matching": [
            "^(null|undefined)$"
        ]
    }
}
```

## `--typesOnlyPrimitives`/`onlyPrimitives`

Whether to exclude type additions that contain complex object types, such as arrays and class instances.
This is particularly useful for `--fixStrictNullChecks`, where the only relevant types are `null` and `undefined`.

```shell
typestat --typesOnlyPrimitives
```

```json
{
    "types": {
        "onlyPrimitives": true
    }
}
```
