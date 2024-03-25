import * as fs from "node:fs";
import * as path from "node:path";

import { TypeStatOptions } from "../../../options/types.js";
import { installWithNpm } from "./installWithNpm.js";
import { installWithYarn } from "./installWithYarn.js";

export const collectPackageManagerRunner = (
	options: TypeStatOptions,
	missingTypes: "npm" | "yarn" | true,
) => {
	if (missingTypes === "npm") {
		return installWithNpm;
	}

	if (
		missingTypes === "yarn" ||
		fs.existsSync(path.join(options.package.directory, "yarn.lock"))
	) {
		return installWithYarn;
	}

	return installWithNpm;
};
