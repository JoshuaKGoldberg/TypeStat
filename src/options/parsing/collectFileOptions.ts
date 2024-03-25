import { Files, RawTypeStatOptions } from "../types.js";

export const collectFileOptions = (rawOptions: RawTypeStatOptions): Files => {
	const files: Partial<Files> =
		rawOptions.files === undefined ? {} : { ...rawOptions.files };

	return {
		above: files.above ?? "",
		below: files.below ?? "",
		renameExtensions: files.renameExtensions ?? false,
	};
};
