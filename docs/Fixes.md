# Fixes

TypeStat will apply the following mutations ("fixes") to files as it finds them.
These mutations are all purely additive and limited to the type system, meaning they will _not_ change your JavaScript output.

For each file it visits, TypeStat will attempt to apply the following mutations in order _(ordered by which is likely to complete first)_:

1. Variables
2. Returns
3. Properties
4. Parameters

Within each round of applying mutations, TypeStat will stop after each step if any mutations are found.

## Types

TypeStat will add the appropriate type annotations for the format of files it receives.
For example, given the following file:

```javascript
function double(x) {
    return x * 2;
}
```

> ❌ Coming soon! ❌
>
> If the file has a `.js` or `.jsx` extension, it will have JSDoc types added:
>
> ```javascript
> /**
>  * @param {number} x
>  * @returns {number}
>  */
> function double(x) {
>     return x * 2;
> }
> ```
>
> ...whereas if the file has a `.ts` or `.tsx` extension, it will have TypeScript types added:
>
> ❌ Coming soon! ❌

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

For example, if a property is originally a `string` but is later assigned `undefined`, it will be changed to have type `number | undefined`:

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

Functions that don't have an explicit return type won't have any types added, as TypeScript will infer their return type.

Before:

```diff
- function abc(def: boolean): string {
+ function abc(def: boolean): string | undefined {
    return def ? "" : undefined;
```

### Variables

Variables later assigned a type not represented by their initial type will have that type added onto them.

For example, if a variable is originally a `string` but is later assigned a `undefined`, it will be changed to have type `number | undefined`:

```diff
- let abc: string = null;
+ let abc: string | null = null;
```
