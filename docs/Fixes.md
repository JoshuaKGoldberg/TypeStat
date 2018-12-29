# Fixes

An optional set of CLI flags or configuration object containing which fixes (type additions) are enabled.
These all default to `false` but can be enabled by being set to `true`.

TypeStat will apply mutations ("fixes") to files as it finds them.
These mutations are all purely additive and limited to the type system, meaning they will _not_ change your JavaScript output.

```json
{
    "fixes": {
        "incompleteTypes": true,
        "missingProperties": true,
        "noImplicitAny": true,
        "noImplicitThis": true,
        "strictNullChecks": true
    }
}
```

## `--fixIncompleteTypes`/`incompleteTypes`

Whether to augment type annotations that don't capture all values constructs can be set to.

This typically isn't useful on its own _(unless you have many incorrect types)_,
but is powerful along with `noImplicitAny` and/or `strictNullChecks` to fix existing codebases for the stricter compiler flags.

```shell
typestat --fixIncompleteTypes
```

```json
{
    "fixes": {
        "incompleteTypes": true
    }
}
```

For example, if a variable is typed as a `number` but is also assigned a `string`, this would change its type to `number | strng`:

```diff
- let abc: number = "";
+ let abc: number | string = "";
```

## `--fixMissingProperties`/`missingProperties`

Whether to apply TypeScript's fixer for missing properties on classes.
If a member is accessed on a class that doesn't declare a property with that name, one will be added in.

Use this when you have classes in files that you've just renamed to `.ts`/`.tsx`.

```shell
typestat --fixMissingProperties
```

```json
{
    "fixes": {
        "missingProperties": true
    }
}
```

For example, if a class assigns a numeric member on itself, one will be declared:

```diff
class Abc {
+   ghi: number;
    def() {
        this.ghi = 1;
    }
}
```

## `--fixNoImplicitAny`/`noImplicitAny`

Whether to add type annotations to types that don't yet have them.
This entirely relies on TypeScript's suggested fixes to infer types from usage.

Use this when you have a lot of code missing type annotations that violates [`--noImplicitAny`](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html).

Places that don't need added types (i.e. would violate [`no-unnecessary-type-annotation`](https://github.com/ajafff/tslint-consistent-codestyle/blob/master/docs/no-unnecessary-type-annotation.md))
won't have them added.

```shell
typestat --fixNoImplicitAny
```

```json
{
    "fixes": {
        "noImplicitAny": true
    }
}
```

For example, if a property has no type declared and no initial value but is later assigned to a `string`, this would add a type of `string`:

```diff
class Abc {
-   private def;
+   private def: string;

    public ghi(def: string) {
        this.def = def;
    }
}
```

<!--
## `--fixNoImplicitThis`/`noImplicitThis`

```shell
typestat --fixNoImplicitThis
```

```json
{
    "fixes": {
        "noImplicitThis": true
    }
}
```

> ❌ Coming soon! ❌
>
> Blocked on https://github.com/Microsoft/TypeScript/issues/28964.
-->

## `--fixStrictNullChecks`/`strictNullChecks`

Whether to add `| null` and `| undefined` types when constructs can be assigned them but aren't.

Useful if your project is already fully onboarded onto `--noImplicitAny` but not [`--strictNullChecks`](https://basarat.gitbooks.io/typescript/docs/options/strictNullChecks.html).

```shell
typestat --fixStrictNullChecks
```

```json
{
    "fixes": {
        "strictNullChecks": true
    }
}
```

For example, if a function is initially marked as returning `string` but can also return `undefined`, this would change its type to `string | undefined`:

```diff
- function abc(def: boolean): string {
+ function abc(def: boolean): string | undefined {
    return def ? "" : undefined;
```
