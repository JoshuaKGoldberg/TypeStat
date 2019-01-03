# Nodes

> Advanced: read [Architecture.md](./Architecture.md) first!

These are the kinds of "nodes", or constructs in your code, that TypeStat will fix.

## Binary Expressions

TypeStat will look at binary expressions where the operator is an equals sign.
When adding strict null checkig mode, assigning values that may contain `null` or `undefined` to a value of a type that may not include them is an error.
If `fixStrictNonNullAssertions` is enabled, a `!` may be added.

```diff
- let abc: string = undefined;
+ let abc: string = undefined!;
```

## Call Expressions

When adding strict null checking mode, calling function-likes with values that aren't nullable may introduce compiler errors.
For example, if a function with one parameter of type `string` is called with an `undefined` argument, it could need a `!` added by `fixStrictNonNullAssertions`:

```diff
function abc(def: string) { }

- abc(undefined);
+ abc(undefined!);
```

## Parameters

Parameters not initially with a declared type or that are later passed a type theirs doesn't include may have that type created or added onto them.

For example, if a parameter violates `--noImplicitAny`, a type may be added by `fixNoImplicitAny`:

```diff
- function abc(def) { }
+ function abc(def: string) { }

abc("");
```

## Property Accesses

### Missing Properties

When `fixMissingProperties` is enabled, any property access that sets a value to a member of `this` will be checked for the "missing property" TypeScript complaint.
For example, if a class assigns a numeric member on itself, one will be declared:

```diff
class Abc {
+   ghi: number;
    def() {
        this.ghi = 1;
    }
}
```

### Strict Property Accesses

Member properties of objects whose types include `null` or `undefined` need a `!` in strict null checking mode.
If `strictNonNullAssertions` is enabled, a `!` will be added in.

For example, if a variable can be `string | undefined`, a `!` will be added before accessing a property on it:

```diff
function abc(def: string | undefined) {
-   abc.length;
+   abc!.length;
}
```

## Property Declarations

Properties later assigned a type not represented by their initial type maybe have that type added onto them by `fixNoImplicitAny` or `fixIncompleteTypes`.

For example, if a property has no type declared and has no initial value but is later assigned to a `string`, `fixNoImplicitAny` would add a type of `string`:

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

Functions that have an explicit return type but can return a different type may have that type added onto their return type by `fixIncompleteTypes`.

For example, if a function is initially marked as returning `string` but can also return `undefined`, `fixIncompleteTypes` would change its type to `string | undefined`:

```diff
- function abc(def: boolean): string {
+ function abc(def: boolean): string | undefined {
    return def ? "" : undefined;
```

Functions that don't have an explicit return type won't have any types added, as TypeScript will infer their return type.

### Variable Declarations

Variables later assigned a type not represented by their initial type may have that type added onto them by `fixIncompleteTypes`.

For example, if a variable is typed as a `number` but is also assigned a `string`, `fixIncompleteTypes` would change its type to `number | strng`:

```diff
- let abc: number = "";
+ let abc: number | string = "";
```
