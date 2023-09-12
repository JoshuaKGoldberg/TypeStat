import { PackageManager, TSInitializeOptions } from "../../types.js";
import { installWithNpm } from "./installWithNpm.js";
import { installWithYarn } from "./installWithYarn.js";

export const collectPackageManagerRunner = (options: TSInitializeOptions) => {
	return options.packageManager === PackageManager.Yarn
		? installWithYarn
		: installWithNpm;
};
