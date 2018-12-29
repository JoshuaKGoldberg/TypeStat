import * as path from "path";

import { TypeStatArgv } from "../index";
import { processLogger } from "../logging/logger";
import { collectOptionals } from "../shared/arrays";
import { collectAsConfiguration } from "../shared/booleans";
import { convertObjectToMap } from "../shared/maps";
import { normalizeAndSlashify } from "../shared/paths";
import { collectAddedMutators } from "./addedMutators";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

export const fillOutRawOptions = (
    argv: TypeStatArgv,
    rawOptions: RawTypeStatOptions,
    fileNames?: ReadonlyArray<string>,
): TypeStatOptions => {
    const rawOptionTypes = rawOptions.types === undefined ? {} : rawOptions.types;

    const options = {
        fileNames,
        filters: collectOptionals(argv.filters, rawOptions.filters),
        fixes: {
            incompleteTypes: false,
            missingProperties: false,
            noImplicitAny: false,
            noImplicitThis: false,
            strictNullChecks: false,
            ...rawOptions.fixes,
        },
        logger: processLogger,
        mutators: collectAddedMutators(argv, rawOptions, processLogger),
        projectPath: getProjectPath(argv, rawOptions),
        types: {
            aliases: rawOptionTypes.aliases === undefined ? new Map() : convertObjectToMap(rawOptionTypes.aliases),
            matching: argv.typesMatching === undefined ? rawOptionTypes.matching : argv.typesMatching,
            onlyPrimitives: collectAsConfiguration(argv.typesOnlyPrimitives, rawOptionTypes.onlyPrimitives),
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

    if (argv.fixStrictNullChecks !== undefined) {
        options.fixes.strictNullChecks = argv.fixStrictNullChecks;
    }

    return options;
};

const getProjectPath = (argv: TypeStatArgv, rawOptions: RawTypeStatOptions): string => {
    if (argv.project !== undefined) {
        return path.join(process.cwd(), argv.project);
    }

    return rawOptions.projectPath === undefined ? normalizeAndSlashify(path.join(process.cwd(), "tsconfig.json")) : rawOptions.projectPath;
};
