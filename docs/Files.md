# Files

An optional set of CLI flags and/or configuration object fields containing file-level changes to make outside of mutations.

```json
{
    "files": {
        "above": "/* Above file */",
        "below": "/* Below file */",
        "renameExtensions": true
    }
}
```

## `--fileAbove`/`above`

```shell
typestat --fileAbove "/* Above file */"
```

```json
{
    "files": {
        "above": "/* Above file */"
    }
}
```

Comment to add above modified files, if any.
If provided, any modified file will have the text inserted as a new first line.

The default is `""`, for no action to take.
If a value is provided on the CLI, it will override a configuration file value (including `""`).

## `--fileBelow`/`below`

```shell
typestat --fileBelow "/* Below file */"
```

```json
{
    "files": {
        "below": "/* Below file */"
    }
}
```

Comment to add below modified files, if any.
If provided, any modified file will have the text inserted as a new last line.

The default is `""`, for no action to take.
If a value is provided on the CLI, it will override a configuration file value (including `""`).

## `--fileCenameExtensions`/`renameExtensions`

```shell
typestat --fileCenameExtensions
```

```json
{
    "files": {
        "renameExtensions": true
    }
}
```

Whether to convert `.js(x)` files to `.ts(x)`.
When this is enabled, any file with a JavaScript extension visited by TypeStat,
regardless of whether mutations are added, will be renamed to the equivalent TypeScript extension.

The default is `false"`.
