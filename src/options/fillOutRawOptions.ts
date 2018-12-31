import * as ts from "typescript";

import { TypeStatArgv } from "../index";
import { processLogger } from "../logging/logger";
import { collectOptionals } from "../shared/arrays";
import { collectAsConfiguration } from "../shared/booleans";
import { convertObjectToMap } from "../shared/maps";
import { collectAddedMutators } from "./addedMutators";
import { RawTypeStatOptions, RawTypeStatTypeOptions, TypeStatOptions } from "./types";

export interface OptionsFromRawOptionsSettings {
    argv: TypeStatArgv;
    compilerOptions: Readonly<ts.CompilerOptions>;
    fileNames?: ReadonlyArray<string>;
    projectPath: string;
    rawOptions: RawTypeStatOptions;
}

export const fillOutRawOptions = ({
    argv,
    compilerOptions,
    fileNames,
    projectPath,
    rawOptions,
}: OptionsFromRawOptionsSettings): TypeStatOptions => {
    const rawOptionTypes = rawOptions.types === undefined ? {} : rawOptions.types;
    const noImplicitAny = collectNoImplicitAny(argv, compilerOptions, rawOptions);
    const { compilerStrictNullChecks, typeStrictNullChecks } = collectStrictNullChecks(argv, compilerOptions, rawOptionTypes);

    const options = {
        compilerOptions: {
            ...compilerOptions,
            noImplicitAny,
            strictNullChecks: compilerStrictNullChecks,
        },
        fileNames,
        filters: collectOptionals(argv.filters, rawOptions.filters),
        fixes: {
            incompleteTypes: false,
            missingProperties: false,
            noImplicitAny: false,
            noImplicitThis: false,
            strictNonNullAssertions: false,
            ...rawOptions.fixes,
        },
        logger: processLogger,
        mutators: collectAddedMutators(argv, rawOptions, processLogger),
        projectPath,
        types: {
            aliases: rawOptionTypes.aliases === undefined ? new Map() : convertObjectToMap(rawOptionTypes.aliases),
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

const collectNoImplicitAny = (
    argv: TypeStatArgv,
    compilerOptions: Readonly<ts.CompilerOptions>,
    rawOptions: RawTypeStatOptions,
): boolean => {
    if (argv.fixNoImplicitAny !== undefined) {
        return argv.fixNoImplicitAny;
    }

    if (rawOptions.fixes !== undefined && rawOptions.fixes.noImplicitAny !== undefined) {
        return rawOptions.fixes.noImplicitAny;
    }

    if (compilerOptions.noImplicitAny !== undefined) {
        return compilerOptions.noImplicitAny;
    }

    return false;
};

const collectStrictNullChecks = (
    argv: TypeStatArgv,
    compilerOptions: Readonly<ts.CompilerOptions>,
    rawOptionTypes: RawTypeStatTypeOptions,
) => {
    const typeStrictNullChecks =
        rawOptionTypes.strictNullChecks === undefined ? argv.typeStrictNullChecks : rawOptionTypes.strictNullChecks;

    const compilerStrictNullChecks = collectCompilerStrictNullChecks(compilerOptions, typeStrictNullChecks);

    return { compilerStrictNullChecks, typeStrictNullChecks };
};

const collectCompilerStrictNullChecks = (
    compilerOptions: Readonly<ts.CompilerOptions>,
    typeStrictNullChecks: boolean | undefined,
): boolean => {
    if (typeStrictNullChecks !== undefined) {
        return typeStrictNullChecks;
    }

    if (compilerOptions.strictNullChecks !== undefined) {
        return compilerOptions.strictNullChecks;
    }

    if (compilerOptions.strict !== undefined) {
        return compilerOptions.strict;
    }

    return false;
};
