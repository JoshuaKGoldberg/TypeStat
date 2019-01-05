# Files

An optional set of CLI flags and/or configuration object fields containing file-level changes to make outside of mutations.

For both of these:

* The default is `""`, for no action to take.
* If a value is provided on the CLI, it will override a configuration file value (including `""`)

```json
{
    "files": {
        "above": "/* Above file */",
        "below": "/* Below file */"
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
