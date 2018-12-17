# Usage

Todo: fill out!

## VS Code (todo: better title re strict null checks)

```json
{
    "filters": [
        "MethodDeclaration[name.text=dispose]",
        "CallExpression[expression.text=teardown]"
    ],
    "fixes": {
        "fixIncompleteTypes": true,
        "strictNullChecks": true
    },
    "types": {
        "matching": "^(null|undefined)$",
        "onlyPrimitives": true
    }
}
```
