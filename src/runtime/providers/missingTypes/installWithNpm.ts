import { TypeStatOptions } from "../../../options/types";

import { runCommand } from "./runCommand";

export const installWithNpm = async (options: TypeStatOptions, missingPackageNames: readonly string[]) => {
    await runCommand(
        options,
        ["npm", "install", ...Array.from(missingPackageNames).map((packageName) => `@types/${packageName}`), "-D"].join(" "),
    );
};
