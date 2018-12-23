# Filters

TypeStat ships with built-in support for using [tsquery](https://github.com/phenomnomnominal/tsquery) to ignore sections of source files.
This is useful for...

* ...when sections of source files can be safely excluded from type coverage
* ...when you want to only touch up certain parts of source files

TypeStat `--filter`/`filter` will _exclude_ any portions of source code that match them.
Sub-sections (child nodes) of those portions will not be visited.

For example, it's common in some architectures for classes to have `dispose()` methods _(mirroring C#'s `IDisposable`)_ where private members are set to `null`.
You can use filter to exclude these `null`s from type calculations.

## `--filter`/`filter`

```shell
typestat --filter "MethodDeclaration[name.text=dispose]"
```

```json
{
    "filter": [
        "MethodDeclaration[name.text=dispose]"
    ]
}
```
