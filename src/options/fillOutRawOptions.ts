import * as ts from "typescript";

import { TypeStatArgv } from "../index";
import { processLogger } from "../logging/logger";
import { arrayify, collectOptionals } from "../shared/arrays";
import { collectAsConfiguration } from "../shared/booleans";
import { collectAddedMutators } from "./addedMutators";
import { collectNoImplicitAny } from "./parsing/collectNoImplicitAny";
import { collectStrictNullChecks } from "./parsing/collectStrictNullChecks";
import { collectTypeAliases } from "./parsing/collectTypeAliases";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

export interface OptionsFromRawOptionsSettings {
    argv: TypeStatArgv;
    compilerOptions: Readonly<ts.CompilerOptions>;
    fileNames?: ReadonlyArray<string>;
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

    const options = {
        compilerOptions: {
            ...compilerOptions,
            noImplicitAny,
            strictNullChecks: compilerStrictNullChecks,
        },
        fileNames,
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
        mutators: collectAddedMutators(argv, rawOptions, processLogger),
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
