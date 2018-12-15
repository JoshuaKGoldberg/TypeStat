import * as path from "path";

import { TypeStatArgv } from "../index";
import { processLogger } from "../logging/logger";
import { convertObjectToMap } from "../shared/maps";
import { normalizeAndSlashify } from "../shared/paths";
import { collectAddedMutators } from "./addedMutators";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

export const fillOutRawOptions = (argv: TypeStatArgv, rawOptions: RawTypeStatOptions, fileNames?: ReadonlyArray<string>): TypeStatOptions => {
    const options = {
        addedMutators: collectAddedMutators(argv, rawOptions, processLogger),
        fileNames,
        fixes: {
            incompleteTypes: false,
            noImplicitAny: false,
            noImplicitThis: false,
            strictNullChecks: false,
            ...rawOptions.fixes,
        },
        logger: processLogger,
        projectPath: rawOptions.projectPath === undefined
            ? normalizeAndSlashify(path.join(process.cwd(), "tsconfig.json"))
            : rawOptions.projectPath,
        typeAliases: rawOptions.typeAliases === undefined
            ? new Map()
            : convertObjectToMap(rawOptions.typeAliases),
    };

    if (argv.fixIncompleteTypes !== undefined) {
        options.fixes.incompleteTypes = argv.fixIncompleteTypes;
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
