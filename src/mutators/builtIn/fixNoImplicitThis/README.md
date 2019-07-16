# `--fixNoImplicitThis`/`noImplicitThis`

Whether to add type annotations to declarations that don't yet have them.

This entirely relies on TypeScript's suggested fixes to infer types from usage.

## Use Cases

* You're converting from JavaScript to TypeScript and want type coverage where possible
* You'd like to enable [`--noImplicitThis`](https://basarat.gitbooks.io/typescript/docs/options/noImplicitThis.html) but have a lot of existing violations

## Configuration

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

## Mutations

### `noImplicitThis` Function Declarations

If a traditional function (`function () {}`) that refers to `this` is declared without a `this` type, this will add one.

#### Examples: `noImplicitThis` Function Declarations

When a function uses `this` and is known to be used in a location where `this` is likely to be set, it can be added in.

For example, in this case, the `this` of `returnThisMember` is almost certainly `Container`:

```diff
- const returnThisMember = function () {
+ const returnThisMember = function (this: Container) {
    return this.member;
}

class Container {
    member = "sample";
    returnThisMember = returnThisMember;
};
```
