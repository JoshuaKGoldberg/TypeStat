/*
This file is a ridiculous, disgusting hack and should not be considered acceptable code to write.
Shame on you for even reading this header, let alone continuing down.

TypeScript uses a function called "isTypeAssignableTo" internally that checks whether something is "assignable" to another.
For example, `5` would be considered assignable to `5`, `number`, `number | string`, `any`, and so on.

The `isTypeAssignableTo` function is not exposed externally.
https://github.com/Microsoft/TypeScript/issues/9879 tracks work to do that properly.

In the meantime, TypeStat needs to use that method, so we do the following:
1. Cry internally
2. Modify the TypeScript file given by `require.resolve` to add `isTypeAssignableTo` to created type checkers
3. Cry some more

Yes, you read that second step correct.
This file finds `typescript.js` on disk and writes a change to expose the function.
💩.
*/

import { fs } from "mz";
import { EOL } from "os";
import { Type } from "typescript";

import { readCharactersOfFile } from "./readCharactersOfFile";

/* tslint:disable no-dynamic-delete no-unsafe-any no-require-imports */

type ArgumentTypes<TFunction> = TFunction extends (...args: infer TArgs) => any ? TArgs : never;

type ReplaceReturnType<TOriginalType, TReturnType> = (...args: ArgumentTypes<TOriginalType>) => TReturnType;

type Replace<TOriginalType, TReplacements extends any> = {
    [Property in keyof TOriginalType]: Property extends keyof TReplacements ? TReplacements[Property] : TOriginalType[Property]
};

export type ExposedTypeScript = Replace<
    typeof import("typescript"),
    {
        createProgram: ReplaceReturnType<(typeof import("typescript"))["createProgram"], ExposedProgram>;
    }
>;

export type ExposedProgram = Replace<
    import("typescript").Program,
    {
        getTypeChecker: ReplaceReturnType<import("typescript").Program["getTypeChecker"], ExposedTypeChecker>;
    }
>;

export type ExposedTypeChecker = import("typescript").TypeChecker & {
    isTypeAssignableTo(source: Type, target: Type): boolean;
};

let previouslyExposedTypeScript: ExposedTypeScript | undefined;

export const requireExposedTypeScript = (): ExposedTypeScript => {
    // If we've already exposed it, use the existing value
    if (previouslyExposedTypeScript !== undefined) {
        return previouslyExposedTypeScript;
    }

    // Find where the file should be required from
    const localRequireFile = require.resolve("typescript");

    // Grab the existing first characters of the file: arbitrarily, 256 of them
    // We read more than just the first line in case other tools have modified it
    const originalContentStart = readCharactersOfFile(localRequireFile, 256);

    // If the file already has a /* TypeStat! */ in there, there's nothing to change
    if (originalContentStart.includes("/* TypeStat! */")) {
        previouslyExposedTypeScript = require(localRequireFile) as ExposedTypeScript;
        return previouslyExposedTypeScript;
    }

    const originalContent = fs.readFileSync(localRequireFile).toString();

    // Save and clear any existing "typescript" module from the require cache
    const originalLocalRequireFile = require.cache[localRequireFile];
    delete require.cache[localRequireFile];

    // Write an export blurb to add `isTypeAssignableTo` to created `checker`s
    fs.writeFileSync(
        localRequireFile,
        [
            "/* TypeStat! */",
            "/* This file was modified by TypeStat to expose isTypeAssignableTo on type checkers. */",
            originalContent.replace("var checker = {", "var checker = { /* TypeStat! */ isTypeAssignableTo,"),
        ].join(EOL),
    );

    // Require this new TypeScript that exposes `isTypeAssignableTo`
    previouslyExposedTypeScript = require(localRequireFile) as ExposedTypeScript;

    // Add back whatever existing module was cached
    delete require.cache[localRequireFile];
    require.cache[localRequireFile] = originalLocalRequireFile;

    // Return the exposed version of TypeScript, and never speak of this again
    return previouslyExposedTypeScript;
};
