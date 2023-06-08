# `suppressTypeErrors`

Whether to add a `// @ts-expect-error` comment directive before each remaining type error.

## Use Cases

* Your existing code has type errors that are too complex or context-dependent for TypeStat to clean up.

## Configuration

```json
{
    "cleanups": {
        "suppressTypeErrors": true
    }
}
```

## Mutations

For each type error still remaining in files, a `// @ts-expect-error` comment will be added with the text of the error:

```diff
+ // @ts-expect-error: Type 'number' is not assignable to type 'string'.
let incorrect: string = 0;
```
