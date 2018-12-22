# Usage

Todo: fill out!

## VS Code (todo: better title re strict null checks)

```json
{
    "filters": [
        "MethodDeclaration[name.text=dispose]",
        "CallExpression[expression.text=teardown]",
        "CallExpression[expression.text=suiteTeardown]"
    ],
    "fixes": {
        "strictNullChecks": true
    }
}
```
