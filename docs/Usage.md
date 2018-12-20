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
        "fixIncompleteTypes": true,
        "strictNullChecks": true
    },
    "types": {
        "matching": "^(null|undefined)$",
        "onlyPrimitives": true
    }
}
```

Example to infinitely run:

```
cls & ( for /L %n in (1,0,10) do ( typestat src/**/*.test.ts --config typestat.json --project src/tsconfig.json --fixStrictNullChecks --fixIncompleteTypes ) )
```