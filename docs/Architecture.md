# Architecture

This document goes over how TypeStart runs and generates fixes.
Before reading this, you should read:

* TypeStat's [README.md](../README.md)
* Documentation on the types of [fixes](./Fixes.md)
* [automutate](https://github.com/automutate/automutate) and [automutate-tests](https://github.com/automutate/automutate)

## Runtime

When the `typestat` command is entered into the CLI, roughly the following happens in order:

1. [bin/typestat](../bin/typestat) calls to the [CLI](../src/cli/index.ts)
2. [Commander.js](https://github.com/tj/commander.js) parses the CLI's arguments
3. An Automutator provider is created for TypeStat with [`createTypeStatMutationsProvider`](../src/runtime/createTypeStatMutationsProvider.ts).

### Mutation Providing

Each round of mutation providing roughly:

1. Records the starting time
2. Creates a set of TypeScript language services
3. For each file to be visited:
    1. Retrieve file mutations for that file
    2. If more than 100 mutations have been collected, or mutations have been collected and it's been more than 10 seconds since the round started, stop the round

Subsequent rounds will pick up where the previous round left off.
For example, given files `a.ts`, `b.ts`, and `c.ts` in order,
if the first round runs on `a.ts` and `b.ts`, the second will start on `c.ts`.

Rounds stop after those thresholds to allow Automutate to write mutations regularly.
TypeStat crashing before a round is complete shouldn't lose all accumulated mutations.

### File Mutations

For each file it visits, [`findMutationsInFile`](../src/runtime/findMutationsInFile.ts) will attempt to apply the following mutations in order
_(ordered by which is likely to complete the fastest)_:

1. Variables
2. Returns
3. Properties
4. Parameters

Within each round of applying mutations, TypeStat will stop after each step if any mutations are found.
Adding mutations from one from can improve mutations from other forms, so reloading the file between rounds could reduce the number of later rounds.

## Directory Structure

The following directories exist under `src/`:

### `logging`

Definition and default implementation of the logger for runtime.
It wraps `process.stderr` and `process.stdout` and is given to the runtime mutators as a member of `options`.

During tests, it'll be stubbed out.

### `mutators`

A file for each of the forms of mutation run in a round.
These are stored in the above fastest-first order in the exported [`defaultFileMutators`](../src/mutators/defaultFileMutators.ts) array.

### `mutations`

Called by the `mutators` to create mutations.
The `mutators` directory figures out which types should be modified, then `mutations` creates mutations to modify them.

We should note two common pieces of terminology used in this directory:

* **"Flags"** refers to type nodes for primitive types, such as `boolean`
* **"Types"** refers to rich (non-primitive) types, such as `MyClass`

### `options`

Parsing logic and TypeScript types for raw and parsed options.

[`loadOptions`](../src/options/loadOptions.ts) will use [Cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find a configuration file if a path isn't provided.
Options parsed from that file will be of type `RawTypeStatOptions`,
and will be filled out into `TypeStatOptions` via [`fillOutRawOptions`](../src/options/fillOutRawOptions.ts).

### `runtime`

Automutate hooks that launch and run the processes described above.
Think of this area as the coordinating force behind mutators.

### `services`

Creates wrappers around the [TypeScript Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
later used by mutators.
These include the [TypeScript Language Service API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API).

Language services are passed to mutators in the form of a [`LanguageServices`](../src/services/language.ts) object.
They're recreated each mutations wave, as the underlying TypeScript source files generally change between wave.

### `shared`

Miscellaneous utilities used by other sections.
