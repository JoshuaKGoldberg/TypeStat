# Suppressions

After TypeStat has applied all the fixes it can to files, there may still be some general cleanups that need to be applied.
Most commonly, any remaining TypeScript type errors may need to be suppressed with `// @ts-expect-error`.

Each classifiation of suppression can be individually configured in your `typestat.json` file.
These all default to `false` but can be enabled by being set to `true`.

```json
{
    "suppressions": {
        "typeErrors": true
    }
}
```

## Suppressors

### `typeErrors`

Whether to add a `// @ts-expect-error` comment directive before each remaining type error.

See [typeErrors/README.md](../src/suppressors/builtin/suppressTypeErrors/README.md).
