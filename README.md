# TypeStat

![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-14cc21.svg)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-informational.svg)
[![Circle CI](https://img.shields.io/circleci/build/github/JoshuaKGoldberg/TypeStat.svg)](https://circleci.com/gh/JoshuaKGoldberg/TypeStat)
[![Join the chat at https://gitter.im/TypeStat/community](https://img.shields.io/badge/chat-gitter-informational.svg)](https://gitter.im/TypeStat/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![NPM version](https://badge.fury.io/js/typestat.svg)](http://badge.fury.io/js/typestat)

**Converts JavaScript to TypeScript** _and TypeScript to better TypeScript._

## Usage

TypeStat is a CLI utility that modifies TypeScript types in existing code.
The built-in mutators will only ever add or remove types and will never change your runtime behavior.
TypeStat can:

<ul style="list-style-type:none;padding-left:1rem;">
    <li>✨ Convert JavaScript files to TypeScript in a single bound!</li>
    <li>✨ Add TypeScript types on files freshly converted from JavaScript to TypeScript!</li>
    <li>✨ Infer types to fix <code>--noImplicitAny</code> and <code>--noImplicitThis</code> violations!</li>
    <li>✨ Annotate missing <code>null</code>s and <code>undefined</code>s to get you started with <code>--strictNullChecks</code>!</li>
    </li>
</ul>

⚡ To start, the `typestat` command will launch an interactive guide to setting up a configuration file.
_Requires [Node LTS](https://nodejs.org/en/about/releases)._

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
3. **[Types.md](./docs/Types.md)** for configuring how to rename types or add comments in mutations
4. **[Filters.md](./docs/Filters.md)** for using [tsquery](https://github.com/phenomnomnominal/tsquery) to ignore sections of source files
5. **[Custom Mutators.md](./docs/Custom%20Mutators.md)** for including or creating custom mutators

## Development

See [Development.md](./docs/Development.md). 💖
