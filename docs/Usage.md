# Usage

You'll need to tailor TypeStat's settings for your project.
It is **strongly recommended** to start with the `typestat` CLI tool to auto-generate a configuration file for you.

## Basic Usage

```shell
npx typestat
```

This will launch an interactive guide to setting up a `typestat.json` configuration file.
That file instructs subsequent runs to apply a series of "fixes" to your code.

```shell
npx typestat --config typestat.json
```

For example, the following `typestat.json` will add auto-fixes for missing type annotations to solve TypeScript's `noImplicitAny` complaints:

```json
{
    "fixes": {
        "noImplicitAny": true,
    }
}
```

### Multi-Step Configurations

`typestat.json` can contain _either_ a single object describing fixes to make _or_ an array of those objects describing fixes to run in order.

For example, the following `typestat.json` will:

1. Add the above `noImplicitAny` fixes
2. Trim out any unnecessary types that TypeScript can infer from usage

```json
[
    {
        "fixes": {
            "noImplicitAny": true
        }
    },
    {
        "fixes": {
            "noInferableTypes": true
        }
    }
]
```

### Verbose Logging

Curious about how fixes are being suggested?
Run with a `--logfile` to get a detailed, verbose log of the exact fixes applied to each file.

```shell
npx typestat --logfile typestat.log
```

## More Examples

Use these examples as more granular references of how to perform targeted changes with TypeStat.
Reach out on [Gitter](https://gitter.im/TypeStat/community) or [Twitter](https://twitter.com/JoshuaKGoldberg) if you want help!

* [Converting Classes from JavaScript to TypeScript.md](./Usage/Converting%20Classes%20from%20JavaScript%20to%20TypeScript.md)
* [Enabling Strict Null Checks](./Usage/Enabling%20Strict%20Null%20Checks.md)
