# `missingProperties`

Whether to apply TypeScript's fixer for missing properties on classes.

This entirely relies on TypeScript's suggested fixes to infer types from usage.

## Use Cases

- You're converting from JavaScript to TypeScript and have classes that contain properties

## Configuration

```json
{
	"fixes": {
		"missingProperties": true
	}
}
```

## Mutations

### Missing Property Accesses

If a member is accessed on a class that doesn't declare a property with that name, one will be added in.

#### Examples: Missing Property Accesses

In a class constructor, if property values are assigned, corresponding properties will be added:

```diff
class Person {
+   happy: boolean;
+   name: string;
    constructor() {
        this.happy = true;
        this.name = "";
    }
}
```

If a class assigns a member on itself after the constructor, a property will be declared:

```diff
class Person {
+   age: number;
    resetAge() {
        this.age = 0;
    }
}
```
