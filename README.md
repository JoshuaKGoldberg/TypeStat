<h1 align="center">TypeStat</h1>

<p align="center"><strong>Converts JavaScript to TypeScript</strong> and <em>TypeScript to better TypeScript</em>.</p>

<p align="center">
    <img alt="Code Style: Prettier" src="https://img.shields.io/badge/code_style-prettier-14cc21.svg" />
    <img alt="TypeScript: Strict" src="https://img.shields.io/badge/typescript-strict-14cc21.svg" />
    <a href="https://github.com/JoshuaKGoldberg/TypeStat/actions/workflows/push.yml">
        <img alt="Build Status" src="https://img.shields.io/github/workflow/status/JoshuaKGoldberg/TypeStat/Push%20CI" />
    </a>
    <a href="http://badge.fury.io/js/typestat">
        <img alt="NPM version" src="https://badge.fury.io/js/typestat.svg" />
    </a>
</p>

<img align="right" alt="TypeStat logo: the TypeScript blue square with rounded corners, but a plus sign instead of 'TS'" src="./typestat.png">

## Usage

TypeStat is a CLI utility that modifies TypeScript types in existing code.
The built-in mutators will only ever add or remove types and will never change your runtime behavior.
TypeStat can:

<ul style="list-style-type:none;padding-left:1rem;">
    <li>✨ Convert JavaScript files to TypeScript in a single bound!</li>
    <li>✨ Add TypeScript types on files freshly converted from JavaScript to TypeScript!</li>
    <li>✨ Infer types to fix <code>--noImplicitAny</code> and <code>--noImplicitThis</code> violations!</li>
    <li>✨ Annotate missing <code>null</code>s and <code>undefined</code>s to get you started with <code>--strictNullChecks</code>!</li>
</ul>

⚡ To start, the `typestat` command will launch an interactive guide to setting up a configuration file. ⚡

```shell
npx typestat
```

> ```shell
> 👋 Welcome to TypeStat! 👋
> This will create a new typestat.json for you.
> ...
> ```

After, use **`typestat --config typestat.json`** to convert your files.

### Configuration

To get a deeper understanding of TypeStat, read the following docs pages in order:

1. **[Usage.md](./docs/Usage.md)** for an explanation of how TypeStat works
2. **[Fixes.md](./docs/Fixes.md)** for the type of fixes TypeStat will generate mutations for
3. **[Cleanups.md](./docs/Cleanups.md)** for the post-fix cleaning TypeStat may apply to files
4. **[Types.md](./docs/Types.md)** for configuring how to work with types in mutations
5. **[Filters.md](./docs/Filters.md)** for using [tsquery](https://github.com/phenomnomnominal/tsquery) to ignore sections of source files
6. **[Custom Mutators.md](./docs/Custom%20Mutators.md)** for including or creating custom mutators

## Development

See [Development.md](./docs/Development.md). 💖
