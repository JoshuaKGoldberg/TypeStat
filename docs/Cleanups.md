# Cleanups

After TypeStat has applied all the fixes it can to files, there may still be some general cleanups that need to be applied.
Most commonly, any remaining TypeScript type errors may need to be suppressed with `// @ts-expect-error`.

Each classification of cleanups can be individually configured in your `typestat.json` file.
These all default to `false` but can be enabled by being set to `true`.

```json
{
	"cleanups": {
		"suppressTypeErrors": true
	}
}
```

## Cleaners

### `suppressTypeErrors`

Whether to add a `// @ts-expect-error` comment directive before each remaining type error.

See [suppressTypeErrors/README.md](../src/cleanups/builtin/suppressTypeErrors/README.md).
