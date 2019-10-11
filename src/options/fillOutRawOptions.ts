import * as ts from "typescript";

import { TypeStatArgv } from "../index";
import { processLogger } from "../logging/logger";
import { collectOptionals } from "../shared/arrays";
import { collectAsConfiguration } from "../shared/booleans";

import { collectAddedMutators } from "./parsing/collectAddedMutators";
import { collectFileOptions } from "./parsing/collectFileOptions";
import { collectNoImplicitAny } from "./parsing/collectNoImplicitAny";
import { collectPackageOptions } from "./parsing/collectPackageOptions";
import { collectStrictNullChecks } from "./parsing/collectStrictNullChecks";
import { collectTypeAliases } from "./parsing/collectTypeAliases";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

export interface OptionsFromRawOptionsSettings {
    argv: TypeStatArgv;
    compilerOptions: Readonly<ts.CompilerOptions>;
    cwd: string;
    fileNames?: readonly string[];
    projectPath: string;
    rawOptions: RawTypeStatOptions;
}

/**
 * Combines Node and CLi argument options with project and file metadata into TypeStat options.
 *
 * @returns Parsed TypeStat options, or a string for an error complaint.
 */
export const fillOutRawOptions = ({
    argv,
    compilerOptions,
    cwd,
    fileNames,
    projectPath,
    rawOptions,
}: OptionsFromRawOptionsSettings): TypeStatOptions | string => {
    const rawOptionTypes = rawOptions.types === undefined ? {} : rawOptions.types,
        noImplicitAny = collectNoImplicitAny(compilerOptions, rawOptions),
        { compilerStrictNullChecks, typeStrictNullChecks } = collectStrictNullChecks(compilerOptions, rawOptionTypes),
        typeAliases = collectTypeAliases(rawOptionTypes);
    if (typeof typeAliases === "string") {
        return typeAliases;
    }

    const packageOptions = collectPackageOptions(cwd, rawOptions),
        shell: readonly string[][] = [];
    if (rawOptions.postProcess !== undefined && rawOptions.postProcess.shell !== undefined) {
        shell.push(...rawOptions.postProcess.shell);
    }

    return {
        compilerOptions: {
            ...compilerOptions,
            noImplicitAny,
            strictNullChecks: compilerStrictNullChecks,
        },
        fileNames,
        files: collectFileOptions(rawOptions),
        filters: collectOptionals(rawOptions.filters),
        fixes: {
            incompleteTypes: false,
            missingProperties: false,
            noImplicitAny: false,
            strictNonNullAssertions: false,
            ...rawOptions.fixes,
        },
        logger: argv.logger,
        mutators: collectAddedMutators(rawOptions, packageOptions.directory, processLogger),
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
