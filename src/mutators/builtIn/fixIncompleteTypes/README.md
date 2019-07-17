# `incompleteTypes`

Whether to augment type annotations that don't capture all values constructs can be set to.

## Use Cases

* You're enabling `strictNullChecks` but existing types don't yet have `| null` or `| undefined` as appropriate
* You're converting from JavaScript to TypeScript and adding React component types

Note that `strictNullChecks` must be enabled in your `tsconfig.json` and/or TypeStat configuration file to add `| null` and `| undefined`.

## Configuration

```json
{
    "fixes": {
        "incompleteTypes": true
    }
}
```

## Mutations

### Incomplete Parameter Types

If a function-like's parameter is declared with a type but other types are passed in, this will add to the declared type.

#### Examples: Incomplete Parameter Types

If a function is declared to take in type `string` but is later passed `number`:

```diff
- function announceValue(value: string) {
+ function announceValue(value: string | number) {
    return "It is " + value;
}

announceValue("me");
announceValue(1);
```

With `--strictNullChecks` enabled, `null` and `undefined` are treated as new types:

```diff
- function getValueOrDefault(value: number) {
+ function getValueOrDefault(value: number | null | undefined) {
    return value == null ? 0 : value;
}

getValueOrDefault(1);
getValueOrDefault(null);
getValueOrDefault(undefined);
```

### Incomplete Property Declaration Types

If a class property declaration is declared with a type but other types are assigned to it, this will add to the declared type.

#### Examples: Incomplete Property Declaration Types

If a property is declared as type `number` but is later assigned `string`:

```diff
class ContainsValue {
-   value: number;
+   value: number | string;

    resetValue() {
        this.value = Math.random() > 0.5 ? 0 : "";
    }
}
```

With `--strictNullChecks` enabled, `null` and `undefined` are treated as new types:

```diff
class ContainsValue {
-   value: string;
+   value: string | null | undefined;

    resetValue(default?: string) {
        this.value = Math.random() > 0.5 ? default : null;
    }
}
```

### Incomplete React Types

React components can have types their props filled in using:

* Component classes:
  * `static propTypes = ...` properties
  * Later-assigned `.propTypes = ...` properties
* Functional components: `propTypes` properties
* Both: regular usage in JSX

Component classes will generate `interface`s, while functional components will generate `type`s.

#### Examples: Incomplete React Classes

Adding in a props interface to an existing component class:

```diff
+ interface NameGreeterProps {
+     name: string;
+ }

- class NameGreeter extends React.Component {
+ class NameGreeter extends React.Component<NameGreeterProps> {
    static propTypes = {
        name: PropTypes.string.isRequired,
    };

    render() {
        return `Hello, ${this.props.name}!`;
    }
}
```

> So far, only class components are implemented, not functional components.
> See [#129](https://github.com/JoshuaKGoldberg/TypeStat/pull/129) for tracking on more!

### Incomplete Return Types

If a function-like is declared as returning a type but may return other types, this will add to the declared type.

#### Examples: Incomplete Return Types

If a function is declared as returning type `number` but can also return `string`:

```diff
- function createValue(): number {
+ function createValue(): number | string {
    return Math.random() > 0.5 ? 0 : "";
}
```

With `--strictNullChecks` enabled, `null` and `undefined` are treated as new types:

```diff
- function createValue(default?: string): number {
+ function createValue(default?: string): string | null | undefined {
    return Math.random() > 0.5 ? default : null;
}
```

### Incomplete Variable Types

If a variable is declared as a type but may be assigned other types, this will add to the declared type.

#### Examples: Incomplete Variable Types

If a variable is declared as type `number` but can also be `string`:

```diff
- const value: number = Math.random() > 0.5 ? 0 : "";
+ const value: number | string = Math.random() > 0.5 ? 0 : "";
```

With `--strictNullChecks` enabled, `null` and `undefined` are treated as new types:

```diff
- let defaultValue: string = "";
+ let defaultValue: string | null | undefined = "";

defaultValue = Math.random() > 0.5 ? null : undefined;
```
