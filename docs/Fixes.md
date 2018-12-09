# Fixes

TypeStat will apply mutations ("fixes") to files as it finds them.
These mutations are all purely additive and limited to the type system, meaning they will _not_ change your JavaScript output.

## Configuring

Each fixer can be configured to suggest no, some, or all forms of type modifications.
These all default to `true` but can be disabled by setting them to false.

```json
{
    "fixes": {
        "incompleteTypes": false,
        "noImplicitAny": false,
        "strictNullChecks": false
    }
}
```

### `incompleteTypes`

Whether to augment type annotations that don't capture all values constructs can be set to.

This typically isn't useful on its own, but is powerful along with `noImplicitAny` and/or `strictNullChecks` to fix existing codebases for the stricter compiler flags.

### `noImplicitAny`

Whether to add type annotations to types that don't yet have them.
This entirely relies on TypeScript's suggested fixes to infer types from usage.

Places that don't need added types (i.e. would violate [`no-unnecessary-type-annotation`](https://github.com/ajafff/tslint-consistent-codestyle/blob/master/docs/no-unnecessary-type-annotation.md))
won't have them added.

### `noImplicitThis`

> ❌ Coming soon! ❌

### `strictNullChecks`

Whether to add `| null` and `| undefined` types when constructs can be assigned them but aren't.
Useful if your project is already fully onboarded onto `--noImplicitAny` but not `--strictNullChecks`.

## Language Modes

TypeStat will add the appropriate type annotations for the format of files it receives.
For example, given the following file:

```javascript
function double(x) {
    return x * 2;
}
```

If the file has a `.js` or `.jsx` extension, it will have JSDoc types added:

```javascript
/**
 * @param {number} x
 * @returns {number}
 */
function double(x) {
    return x * 2;
}
```

...whereas if the file has a `.ts` or `.tsx` extension, it will have TypeScript types added:

```typescript
function double(x: number): number {
    return x * 2;
}
```

## Fixers

### Parameters

> ❌ Coming soon! ❌

### Properties

Properties later assigned a type not represented by their initial type will have that type added onto them.

For example, if a property has no type, `noImplicitAny`

```diff
class Abc {
-   private def: string;
+   private def: string | undefined;

    public ghi(def: string | undefined) {
        this.def = def;
    }
}
```

If a property's type doesn't change, it won't have any modifications.

### Returns

Functions that have an explicit return type but can return a different type will have that type added onto their return type.

For example, if a function is initially marked as returning `string` but can also return `undefined`, `strictNullChecks` would change its type to `string | undefined`:

```diff
- function abc(def: boolean): string {
+ function abc(def: boolean): string | undefined {
    return def ? "" : undefined;
```

Functions that don't have an explicit return type won't have any types added, as TypeScript will infer their return type.

### Variables

Variables later assigned a type not represented by their initial type will have that type added onto them.

For example, if a variable is typed as a `number` but is also assigned a `string`, `incompleteTypes` would change its type to `number | strng`:

```diff
- let abc: number = "";
+ let abc: number | string = "";
```
