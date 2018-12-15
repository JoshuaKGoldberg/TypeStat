# Nodes

> Advanced: read [Architecture.md](./Architecture.md) first!

These are the kinds of "nodes", or constructs in your code, that TypeStat will fix.

## Parameters

> ❌ Coming soon! ❌

## Properties

Properties later assigned a type not represented by their initial type will have that type added onto them.

For example, if a property has no type declared and no initial value but is later assigned to a `string`, `noImplicitAny` would add a type of `string`:

```diff
class Abc {
-   private def;
+   private def: string;

    public ghi(def: string) {
        this.def = def;
    }
}
```

If a property's type doesn't change, it won't have any modifications.

## Returns

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
