import { TypeStatArgv } from "../../index";
import { Files, RawTypeStatOptions } from "../types";

export const collectFileOptions = (argv: TypeStatArgv, rawOptions: RawTypeStatOptions): Files => {
    const files: Partial<Files> = rawOptions.files === undefined ? {} : { ...rawOptions.files };

    if (argv.fileAbove !== undefined) {
        files.above = argv.fileAbove;
    }

    if (argv.fileBelow !== undefined) {
        files.below = argv.fileBelow;
    }

    return {
        above: files.above === undefined ? "" : files.above,
        below: files.below === undefined ? "" : files.below,
        renameExtensions: (argv.fileRenameExtensions === undefined ? files.renameExtensions : argv.fileRenameExtensions) || false,
    };
};
