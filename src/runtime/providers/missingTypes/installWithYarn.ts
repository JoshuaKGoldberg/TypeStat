import { TypeStatOptions } from "../../../options/types";

import { runCommand } from "./runCommand";

export const installWithYarn = async (options: TypeStatOptions, missingPackageNames: readonly string[]) => {
    await runCommand(
        options,
        ["yarn", "add", ...Array.from(missingPackageNames).map((packageName) => `@types/${packageName}`), "-D"].join(" "),
    );
};
