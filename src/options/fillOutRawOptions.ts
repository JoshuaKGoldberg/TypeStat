import * as ts from "typescript";

import { TypeStatArgv } from "../index";
import { ProcessOutput } from "../output";
import { collectOptionals } from "../shared/arrays";
import { collectAsConfiguration } from "../shared/booleans";
import { ReactPropTypesHint, ReactPropTypesOptionality } from "./enums";

import { collectAddedMutators } from "./parsing/collectAddedMutators";
import { collectFileOptions } from "./parsing/collectFileOptions";
import { collectNoImplicitAny } from "./parsing/collectNoImplicitAny";
import { collectNoImplicitThis } from "./parsing/collectNoImplicitThis";
import { collectPackageOptions } from "./parsing/collectPackageOptions";
import { collectStrictNullChecks } from "./parsing/collectStrictNullChecks";
import { collectTypeAliases } from "./parsing/collectTypeAliases";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

export interface OptionsFromRawOptionsSettings {
    argv: TypeStatArgv;
    compilerOptions: Readonly<ts.CompilerOptions>;
    cwd: string;
    fileNames?: ReadonlyArray<string>;
    output: ProcessOutput;
    projectPath: string;
    rawOptions: RawTypeStatOptions;
}

/**
 * Combines Node and CLi argument options with project and file metadata into TypeStat options.
 *
 * @returns Parsed TypeStat options, or a string for an error complaint.
 */
export const fillOutRawOptions = ({
    compilerOptions,
    cwd,
    fileNames,
    output,
    projectPath,
    rawOptions,
}: OptionsFromRawOptionsSettings): TypeStatOptions | string => {
    const rawOptionTypes = rawOptions.types === undefined ? {} : rawOptions.types;
    const noImplicitAny = collectNoImplicitAny(compilerOptions, rawOptions);
    const noImplicitThis = collectNoImplicitThis(compilerOptions, rawOptions);
    const { compilerStrictNullChecks, typeStrictNullChecks } = collectStrictNullChecks(compilerOptions, rawOptionTypes);

    const typeAliases = collectTypeAliases(rawOptionTypes);
    if (typeof typeAliases === "string") {
        return typeAliases;
    }

    const packageOptions = collectPackageOptions(cwd, rawOptions);

    const shell: ReadonlyArray<string>[] = [];
    if (rawOptions.postProcess !== undefined && rawOptions.postProcess.shell !== undefined) {
        shell.push(...rawOptions.postProcess.shell);
    }

    return {
        compilerOptions: {
            ...compilerOptions,
            noImplicitAny,
            noImplicitThis,
            strictNullChecks: compilerStrictNullChecks,
        },
        fileNames,
        files: collectFileOptions(rawOptions),
        filters: collectOptionals(rawOptions.filters),
        fixes: {
            importExtensions: false,
            incompleteTypes: false,
            missingProperties: false,
            noImplicitAny: false,
            noImplicitThis: false,
            noInferableTypes: false,
            strictNonNullAssertions: false,
            ...rawOptions.fixes,
        },
        hints: {
            react: {
                propTypes: rawOptions.hints?.react?.propTypes ?? ReactPropTypesHint.WhenRequired,
                propTypesOptionality: rawOptions.hints?.react?.propTypesOptionality ?? ReactPropTypesOptionality.AsWritten,
            },
        },
        mutators: collectAddedMutators(rawOptions, packageOptions.directory, output),
        output,
        package: packageOptions,
        postProcess: { shell },
        projectPath,
        types: {
            aliases: typeAliases,
            matching: rawOptionTypes.matching,
            onlyPrimitives: collectAsConfiguration(rawOptionTypes.onlyPrimitives),
            strictNullChecks: typeStrictNullChecks,
        },
    };
};
