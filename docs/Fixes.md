# Fixes

TypeStat will apply mutations ("fixes") to files as it finds them.
These mutations are all purely additive and limited to the type system, meaning they will _not_ change your JavaScript output.

Each classifiation of fix can be individually configured in your `typestat.json` file.
These all default to `false` but can be enabled by being set to `true`.

```json
{
    "fixes": {
        "incompleteTypes": true,
        "missingProperties": true,
        "noImplicitAny": true,
        "noImplicitThis": true,
        "noInferableTypes": true,
        "strictNonNullAssertions": true
    }
}
```

## Fixers

### `incompleteTypes`

Whether to augment type annotations that don't capture all values constructs can be set to.

See [fixIncompleteTypes/README.md](../src/mutators/builtIn/fixIncompleteTypes/README.md).

### `missingProperties`

Whether to apply TypeScript's fixer for missing properties on classes.

See [fixMisingProperties/README.md](../src/mutators/builtIn/fixMissingProperties/README.md).

### `noImplicitAny`

Whether to add type annotations to declarations that don't yet have them.

See [fixNoImplicitAny/README.md](../src/mutators/builtIn/fixNoImplicitAny/README.md).

### `noImplicitThis`

Whether to add `this` type annotations to functions that don't yet have them.

See [fixNoImplicitThis/README.md](../src/mutators/builtIn/fixNoImplicitThis/README.md).

### `noInferableTypes`

Whether to remove type annotations that don't change the meaning of code.

See [noInferableTypes/README.md](../src/mutators/builtIn/fixNoInferableTypes/README.md).

### `strictNonNullAssertions`

Whether to add missing non-null assertions.

See [fixStrictNonNullAssertions/README.md](../src/mutators/builtIn/fixStrictNonNullAssertions/README.md).
