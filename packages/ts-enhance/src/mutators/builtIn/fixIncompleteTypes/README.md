# `incompleteTypes`

Whether to augment type annotations that don't capture all values constructs can be set to.

## Use Cases

- You're enabling `strictNullChecks` but existing types don't yet have `| null` or `| undefined` as appropriate
- You're converting from JavaScript to TypeScript and adding React component types

## Configuration

```json
{
	"fixes": {
		"incompleteTypes": true
	}
}
```

> Note: if you'd like to add `| null` and `| undefined` to types, `strictNullChecks` must be enabled in your `tsconfig.json` and/or `ts-enhance` configuration file.

## Mutations

### Incomplete Implicit Generics

If a class variable is declared that should have a templated ("generic") type declared but doesn't, this will add it in.

#### Example: Incomplete Class Generics

If a class is extended that needs its generic type explicitly stated:

```diff
class OneTypeParameter<TFirst> {
    first: TFirst;
}

+ type ExtendingWithAddedFirst = {
+     added?: boolean;
+ };

- class ExtendingWithAdded extends OneTypeParameter {
+ class ExtendingWithAdded extends OneTypeParameter<ExtendingWithAddedFirst> {
    constructor() {
        super();
        this.first = {
            added: true,
        };
    }
}
```

#### Example: Incomplete Variable Generics

If an array is created but the type isn't inferrable:

```diff
- const names = [];
+ const names: string[] = [];

names.push("Josh");
```

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

- Component classes:
  - `static propTypes = ...` properties
  - Later-assigned `.propTypes = ...` properties
- Functional components: `propTypes` properties
- Both: regular usage in JSX

Component classes will generate `interface`s, while function components will generate `type`s.

#### Example: Incomplete Component Classes

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

### Example: Incomplete Function Components

Adding in a props type to an existing function component:

```diff
+ type NamedGreeterProps = {
+     name: string;
+ }

- const NamedGreeter = ({ name }) => {
+ const NamedGreeter: React.FC<NamedGreeterProps> = ({ name }) => {
    return `Hello, ${this.props.name}!`;
};
```

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
