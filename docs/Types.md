# Types

_to be filled out soon!_

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
