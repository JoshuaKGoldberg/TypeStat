# Types

## `strictNullChecks`

Whether to override the project's [`--strictNullChecks`](https://basarat.gitbooks.io/typescript/docs/options/strictNullChecks.html) setting.
If true, `ts-enhance` will set `strictNullChecks` to `true` regardless of your `tsconfig.json`.

```json
{
	"types": {
		"strictNullChecks": true
	}
}
```

This interacts with fixers in a few ways:

- Type additions will now include `null` and/or `undefined`
- [Property Accesses](./Nodes.md#Strict%20Property%20Accesses) will have `!`s added as needed
