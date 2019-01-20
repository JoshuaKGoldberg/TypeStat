import * as path from "path";

import { TypeStatArgv } from "../../index";
import { normalizeAndSlashify } from "../../shared/paths";
import { Package, RawTypeStatOptions } from "../types";

export const collectPackageOptions = (argv: TypeStatArgv, packageDirectory: string, rawOptions: RawTypeStatOptions): Package => {
    const rawPackageOptions = rawOptions.package === undefined ? {} : rawOptions.package;

    const rawPackageFile = argv.packageFile === undefined ? rawPackageOptions.file : argv.packageFile;

    const file =
        rawPackageFile === undefined || path.isAbsolute(rawPackageFile)
            ? normalizeAndSlashify(path.join(packageDirectory, "package.json"))
            : normalizeAndSlashify(rawPackageFile);

    return {
        directory: packageDirectory,
        file,
        missingTypes: argv.packageMissingTypes === undefined ? rawPackageOptions.missingTypes : argv.packageMissingTypes,
    };
};
