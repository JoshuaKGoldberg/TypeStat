# `noInferableTypes`

Whether to remove type annotations that don't change the meaning of code.

# Use Cases

- Your code was recently converted from JavaScript to TypeScript and previously useful type declarations are now visual clutter
- You used to always add type declarations, but have since realized doing so unnecessary is a futile and wasteful act

## Configuration

```json
{
	"fixes": {
		"noInferableTypes": true
	}
}
```

## Mutations

### `noInferableTypes` Parameters

If a function-like's parameter is declared with a default value ("initializer") and a type that would already be inferred from that initializer, this removes the type.

#### Examples: `noInferableTypes` Parameters

When a parameter is declared with a `: number` type declaration and a numeric initializer:

```diff
- function receivesNumber(value: number = 0) {
+ function receivesNumber(value = 0) {
    return value * 2;
}
```

### `noInferableTypes` Properties

If a class property is declared with a default value ("initializer") and a type that would already be inferred from that initializer, this removes the type.

#### Examples: `noInferableTypes` Properties

```diff
class Person {
-   age: number = 0;
+   age = 0;
}
```

### `noInferableTypes` Variables

`const` variables will always have their declarations removed, as TypeScript will always infer as narrow a type for them as possible.

`let` variables will have type declarations removed if they have an initial value ("initializer") and the declared type is the same as what would be inferred from that initializer.

#### Examples: `noInferableTypes` Variables

`const` variables always have their declarations removed:

```diff
- const value: number = 0;
+ const value = 0;
```

`let` variables only have their declarations removed if they don't add anything to the variable's type information:

```diff
- let value: number = 0;
+ let value = 0;

let either: number | string = 0;
```
