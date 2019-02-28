import { TypeStatOptions } from "../../../options/types";

import { runCommand } from "./runCommand";

export const installWithNpm = async (options: TypeStatOptions, missingPackageNames: ReadonlyArray<string>) => {
    await runCommand(
        options,
        ["npm", "install", ...Array.from(missingPackageNames).map((packageName) => `@types/${packageName}`), "-D"].join(" "),
    );
};
