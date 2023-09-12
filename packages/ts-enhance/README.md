<h1 align="center">ts-enhance</h1>

<p align="center">Improves a project's TypeScript code by creating and improving types. 💗</p>

## Usage

TypeStat is a CLI utility that modifies TypeScript types in existing code.
It can:

- Add type annotations to fix [`noImplicitAny`](https://aka.ms/tsconfig#noImplicitAny) and [`noImplicitThis`](https://aka.ms/tsconfig#noImplicitThis) type errors
- Annotate missing `null`s and `undefined`s to fix [`strictNullChecks`](https://aka.ms/tsconfig#strictNullChecks) type errors
- Remove unnecessary annotations for types that can be inferred
- Remove unnecessary constituents and members of union types and object types

⚡ To start, the **`ts-enhance`** command will launch an interactive guide to setting up a configuration file. ⚡

```shell
npx ts-enhance
```

> ```shell
> 👋 Welcome to ts-enhance! 👋
> This will create a new ts-enhance.json for you.
> ...
> ```

After, use **`ts-enhance --config ts-enhance.json`** to convert your files with the same settings.

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

> 💙 This package is based on [@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg)'s [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app).
