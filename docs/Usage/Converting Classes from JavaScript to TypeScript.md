# Converting Classes from JavaScript to TypeScript

Converting classes from JavaScript to TypeScript tends to be one of the more painful parts of conversions,
since classes in TypeScript need to have member properties declared.

TypeScript provides a feature to infer and add those properties.
Use `fixes.missingProperties` to apply those mutations across all files:

```json
{
    "fixes": {
        "missingProperties": true
    }
}
```