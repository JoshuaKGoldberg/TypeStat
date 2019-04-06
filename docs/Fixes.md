# Fixes

A set of CLI flags and/or configuration object fields containing which fixes (type additions) are enabled.
These all default to `false` but can be enabled by being set to `true`.

TypeStat will apply mutations ("fixes") to files as it finds them.
These mutations are all purely additive and limited to the type system, meaning they will _not_ change your JavaScript output.

```json
{
    "fixes": {
        "incompleteTypes": true,
        "missingProperties": true,
        "noImplicitAny": true,
        "strictNonNullAssertions": true
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

For example, if a variable is typed as a `number` but is also assigned a `string`, this would change its type to `number | string`:

```diff
- let abc: number = "";
+ let abc: number | string = "";
```

### React

React components can have types their props and states filled in using:

* Component classes: static `propTypes` properties
* Functional components: `propTypes` properties
* Both: regular usage in JSX

Component classes will generate `interface`s, while functional components will generate `type`s.

For example, the change to this `NameGreeter` component would be:

```diff
+ type NameGreeterProps = {
+     name: string;
+ };
+
- const NameGreeter = (props) => <span>Hello, {props.name}!</span>;
+ const NameGreeter: React.FC<NameGreeterProps> = (props) => <span>Hello, {props.name}!</span>;

NameGreeter.propTypes = {
    name: PropTypes.string.isRequired,
};
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

## `--fixStrictNonNullAssertions`/`strictNonNullAssertions`

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

Whether to add missing non-null assertions.
This can add `!s` in:

* Binary expressions
* Nullable property accesses
* Function-like calls
* Return statements

Note that `strictNullChecks` must be enabled in your `tsconfig.json` and/or TypeStat configuration file.

If a binary expression improperly assigns a value of that type:

```diff
- let abc: string = undefined;
+ let abc: string = undefined!;
```

If a member of a nullable object is requested:

```diff
let abc: string | undefined = "def";

- abc.length;
+ abc!.length;
```

Passing a nullable object to a function call of a parameter that can't be nullable:

```diff
function abc(def: string | undefined) { /* ... */ }

let def: string | undefined = "ghi";

- abc(def);
+ abc(def!);
```

Returning a nullable type in a function with a non-nullable return type:

```diff
function abc(): string {
    let def: string | undefined = "ghi";

-   return def;
+   return def!;
}
```