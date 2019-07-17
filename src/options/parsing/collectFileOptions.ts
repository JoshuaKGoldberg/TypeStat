import { Files, RawTypeStatOptions } from "../types";

export const collectFileOptions = (rawOptions: RawTypeStatOptions): Files => {
    const files: Partial<Files> = rawOptions.files === undefined ? {} : { ...rawOptions.files };

    return {
        above: files.above === undefined ? "" : files.above,
        below: files.below === undefined ? "" : files.below,
        renameExtensions: files.renameExtensions === undefined ? false : files.renameExtensions,
    };
};
