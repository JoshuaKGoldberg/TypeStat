# `noImplicitAny`

Whether to add type annotations to declarations that don't yet have them.

This entirely relies on TypeScript's suggested fixes to infer types from usage.

## Use Cases

* You're converting from JavaScript to TypeScript and want type coverage where possible
* You'd like to enable [`--noImplicitAny`](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html) but have a lot of existing violations

Places that don't need added types (i.e. would violate [`no-unnecessary-type-annotation`](https://github.com/ajafff/tslint-consistent-codestyle/blob/master/docs/no-unnecessary-type-annotation.md))
won't have them added.

## Configuration

```json
{
    "fixes": {
        "noImplicitAny": true
    }
}
```

## Mutations

### `noImplicitAny` Parameters

If a function-like's parameter is declared without a type, this will add one.

#### Examples: `noImplicitAny` Parameters

When a parameter is declared without a type but later passed in as `number`, TypeScript can infer the type from its usage:

```diff
- function receivesNumber(value) {
+ function receivesNumber(value: number) {
    return value * 2;
}

receivesNumber(1);
```

### `noImplicitAny` Property Declarations

If a class property is declared without a type, this will add one.

#### Examples: `noImplicitAny` Property Declarations

When a class property is declared without a type but is later assigned `number`,  TypeScript can infer the type from its usage:

```diff
class Person {
-   age;
+   age: number;
    resetAge() {
        this.age = 0;
    }
}
```

### `noImplicitAny` Variables

If a variable is declared without a type, this will add one.

#### Examples: `noImplicitAny` Variables

When a variable is declared without a type but is later assigned `number`, TypeScript can infer the type from its usage:

```diff
- let value;
+ let value: number;

value = 0;
```
