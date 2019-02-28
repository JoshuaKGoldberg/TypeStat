import * as ts from "typescript";

import { TypeStatArgv } from "../index";
import { processLogger } from "../logging/logger";
import { arrayify, collectOptionals } from "../shared/arrays";
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
    fileNames?: ReadonlyArray<string>;
    packageDirectory: string;
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
    fileNames,
    packageDirectory,
    projectPath,
    rawOptions,
}: OptionsFromRawOptionsSettings): TypeStatOptions | string => {
    const rawOptionTypes = rawOptions.types === undefined ? {} : rawOptions.types;
    const noImplicitAny = collectNoImplicitAny(argv, compilerOptions, rawOptions);
    const { compilerStrictNullChecks, typeStrictNullChecks } = collectStrictNullChecks(argv, compilerOptions, rawOptionTypes);

    const typeAliases = collectTypeAliases(argv, rawOptionTypes);
    if (typeof typeAliases === "string") {
        return typeAliases;
    }

    const packageOptions = collectPackageOptions(argv, packageDirectory, rawOptions);

    const options = {
        compilerOptions: {
            ...compilerOptions,
            noImplicitAny,
            strictNullChecks: compilerStrictNullChecks,
        },
        fileNames,
        files: collectFileOptions(argv, rawOptions),
        filters: collectOptionals(arrayify(argv.filter), rawOptions.filters),
        fixes: {
            incompleteTypes: false,
            missingProperties: false,
            noImplicitAny: false,
            noImplicitThis: false,
            strictNonNullAssertions: false,
            ...rawOptions.fixes,
        },
        logger: argv.logger,
        mutators: collectAddedMutators(argv, rawOptions, packageOptions.directory, processLogger),
        package: packageOptions,
        projectPath,
        types: {
            aliases: typeAliases,
            matching: argv.typeMatching === undefined ? rawOptionTypes.matching : argv.typeMatching,
            onlyPrimitives: collectAsConfiguration(argv.typeOnlyPrimitives, rawOptionTypes.onlyPrimitives),
            strictNullChecks: typeStrictNullChecks,
        },
    };

    if (argv.fixIncompleteTypes !== undefined) {
        options.fixes.incompleteTypes = argv.fixIncompleteTypes;
    }

    if (argv.fixMissingProperties !== undefined) {
        options.fixes.missingProperties = argv.fixMissingProperties;
    }

    if (argv.fixNoImplicitAny !== undefined) {
        options.fixes.noImplicitAny = argv.fixNoImplicitAny;
    }

    if (argv.fixNoImplicitThis !== undefined) {
        options.fixes.noImplicitThis = argv.fixNoImplicitThis;
    }

    if (argv.fixStrictNonNullAssertions !== undefined) {
        options.fixes.strictNonNullAssertions = argv.fixStrictNonNullAssertions;
    }

    return options;
};
