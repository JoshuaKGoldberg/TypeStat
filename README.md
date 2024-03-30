<h1 align="center">TypeStat</h1>

<p align="center">Converts JavaScript to TypeScript and TypeScript to better TypeScript. 🧫</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 12" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-12-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/TypeStat/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/TypeStat" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/TypeStat?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/TypeStat/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/typestat"><img alt="📦 npm version" src="https://img.shields.io/npm/v/typestat?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

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

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md) for general tooling documentation.
For understanding the project, see `./docs` in general, and especially [`./docs/Architecture.md`](./docs/Architecture.md).
Thanks! 💖

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://sourcegraph.com/"><img src="https://avatars.githubusercontent.com/u/1646931?v=4?s=100" width="100px;" alt="Beyang Liu"/><br /><sub><b>Beyang Liu</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=beyang" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://danstiner.me/"><img src="https://avatars.githubusercontent.com/u/52513?v=4?s=100" width="100px;" alt="Daniel Stiner"/><br /><sub><b>Daniel Stiner</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/issues?q=author%3Adanstiner" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ghost"><img src="https://avatars.githubusercontent.com/u/10137?v=4?s=100" width="100px;" alt="Deleted user"/><br /><sub><b>Deleted user</b></sub></a><br /><a href="#maintenance-ghost" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/emday4prez"><img src="https://avatars.githubusercontent.com/u/35363144?v=4?s=100" width="100px;" alt="Emerson"/><br /><sub><b>Emerson</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=emday4prez" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://girish.netlify.app/"><img src="https://avatars.githubusercontent.com/u/61848210?v=4?s=100" width="100px;" alt="Girish Sontakke"/><br /><sub><b>Girish Sontakke</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=girishsontakke" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://maps.guten.me/"><img src="https://avatars.githubusercontent.com/u/377544?v=4?s=100" width="100px;" alt="Guten"/><br /><sub><b>Guten</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/issues?q=author%3Agutenye" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://stackoverflow.com/users/5494094/ibrahim-h"><img src="https://avatars.githubusercontent.com/u/1217741?v=4?s=100" width="100px;" alt="Ibrahim H."/><br /><sub><b>Ibrahim H.</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=bitsnaps" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="https://github.com/JoshuaKGoldberg/TypeStat/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=JoshuaKGoldberg" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/markjm-1/"><img src="https://avatars.githubusercontent.com/u/16494982?v=4?s=100" width="100px;" alt="Mark Molinaro"/><br /><sub><b>Mark Molinaro</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/issues?q=author%3Amarkjm" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=markjm" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://cress.soc.surrey.ac.uk/web/people/ngilbert"><img src="https://avatars.githubusercontent.com/u/1449986?v=4?s=100" width="100px;" alt="Nigel Gilbert"/><br /><sub><b>Nigel Gilbert</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/issues?q=author%3Amicrology" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://orionna.me/"><img src="https://avatars.githubusercontent.com/u/85230052?v=4?s=100" width="100px;" alt="orionna319"/><br /><sub><b>orionna319</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/issues?q=author%3Aorionna319" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rubiesonthesky"><img src="https://avatars.githubusercontent.com/u/2591240?v=4?s=100" width="100px;" alt="rubiesonthesky"/><br /><sub><b>rubiesonthesky</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/TypeStat/issues?q=author%3Arubiesonthesky" title="Bug reports">🐛</a> <a href="#maintenance-rubiesonthesky" title="Maintenance">🚧</a> <a href="#tool-rubiesonthesky" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/TypeStat/commits?author=rubiesonthesky" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💙 This package is based on [@JoshuaKGoldberg](https://github.com/JoshuaKGoldberg)'s [TypeStat](https://github.com/JoshuaKGoldberg/TypeStat).
