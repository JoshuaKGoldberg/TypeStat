# `--fixStrictNonNullAssertions`/`strictNonNullAssertions`

Whether to add missing non-null assertions.

## Use Cases

You'd like to enable [`--strictNullChecks`](https://basarat.gitbooks.io/typescript/docs/options/strictNullChecks.html) but:

* You'd like to enable the setting now and clean up existing violations later
* Your tests pass nullable values in places that otherwise shouldn't accept them

Note that `strictNullChecks` must be enabled in your `tsconfig.json` and/or TypeStat configuration file.

## Configuration

```shell
typestat --fixStrictNonNullAssertions
```

```json
{
    "fixes": {
        "strictNonNullAssertions": true
    }
}
```

## Mutations

### strictNonNullAssertion BinaryExpressions

If a member or variable is assigned a nullable value that it shouldn't be, this will add an `!` assertion.

#### Examples: strictNonNullAssertion Binary Expressions

When a variable is of type `string` but is assigned `null`:

```diff
- let name: string = null;
+ let name: string = null!;
```

### strictNonNullAssertion CallExpressions

If a function-like is called with a null-ish value in a parameter that shouldn't be nullable, this will add a `!` assertion.

#### Examples: strictNonNullAssertion Call Expressions

When a function is called with `undefined` in a parameter that accepts only `number`:

```diff
function defaultNumber(value: number) {
    return value || 0;
}

- defaultNumber(undefined);
+ defaultNumber(undefined!);
```

### strictNonNullAssertion PropertyAccesses

If a property is accessed from a nullable object, this will add a `!` assertion.

#### Examples: strictNonNullAssertion Property Accesses

When an array is declared as nullable but a property is accessed on it anyway:

```diff
function getLength(values?: boolean[]) {
-   return values.length;
+   return values.length!;
}
```

### strictNonNullAssertion ReturnTypes

If a function-like returns a nullable value but shouldn't, this will add a `!` assertion.

#### Examples: strictNonNullAssertion Return Types

When a function is declared as returning `number` but can return `null`:

```diff
- function defaultValue(): number {
+ function defaultValue(): number | null {
    return Math.random() > 0.5 ? 0 : null;
}
```
