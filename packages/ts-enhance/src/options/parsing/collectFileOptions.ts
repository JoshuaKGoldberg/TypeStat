import { Files, RawTSEnhanceOptions } from "../types.js";

export const collectFileOptions = (rawOptions: RawTSEnhanceOptions): Files => {
	const files: Partial<Files> =
		rawOptions.files === undefined ? {} : { ...rawOptions.files };

	return {
		above: files.above === undefined ? "" : files.above,
		below: files.below === undefined ? "" : files.below,
		renameExtensions:
			files.renameExtensions === undefined ? false : files.renameExtensions,
	};
};
