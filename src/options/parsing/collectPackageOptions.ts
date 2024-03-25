import * as path from "node:path";

import { normalizeAndSlashify } from "../../shared/paths.js";
import { Package, RawTypeStatOptions } from "../types.js";

export const collectPackageOptions = (
	cwd: string,
	rawOptions: RawTypeStatOptions,
): Package => {
	const rawPackageOptions = rawOptions.package ?? {};
	const rawPackageFile = rawPackageOptions.file;

	const file = collectRawPackageFile(cwd, rawPackageFile);

	return {
		directory: cwd,
		file,
		missingTypes: rawPackageOptions.missingTypes,
	};
};

const collectRawPackageFile = (
	cwd: string,
	rawPackageFile: string | undefined,
) => {
	if (rawPackageFile === undefined) {
		return normalizeAndSlashify(path.join(cwd, "package.json"));
	}

	if (path.isAbsolute(rawPackageFile)) {
		return normalizeAndSlashify(rawPackageFile);
	}

	return normalizeAndSlashify(path.join(cwd, rawPackageFile));
};
