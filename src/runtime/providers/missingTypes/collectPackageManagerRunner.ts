import { fs } from "mz";
import * as path from "path";

import { TypeStatOptions } from "../../../options/types";
import { installWithNpm } from "./installWithNpm";
import { installWithYarn } from "./installWithYarn";

export const collectPackageManagerRunner = async (options: TypeStatOptions, missingTypes: true | "npm" | "yarn") => {
    if (missingTypes === "npm") {
        return installWithNpm;
    }

    if (missingTypes === "yarn" || (await fs.exists(path.join(options.package.directory, "yarn.lock")))) {
        return installWithYarn;
    }

    return installWithNpm;
};
