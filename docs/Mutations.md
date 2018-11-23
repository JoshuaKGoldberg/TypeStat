# Mutations

TypeStat will apply the following mutations to files as it finds them.
These mutations are all purely additive and limited to the type system, meaning they will _not_ change your JavaScript output.

## Parameters

> ❌ Coming soon! ❌

## Properties

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

## Returns

Functions that have an explicit return type but can return a different type will have that type added onto their return type.

Functions that don't have an explicit return type won't have any types added, as TypeScript will infer their return type.

Before:

```diff
- function abc(def: boolean): string {
+ function abc(def: boolean): string | undefined {
    return def ? "" : undefined;
```

## Variables

Variables later assigned a type not represented by their initial type will have that type added onto them.

For example, if a variable is originally a `string` but is later assigned a `undefined`, it will be changed to have type `number | undefined`:

```diff
- let abc: string = null;
+ let abc: string | null = null;
```
