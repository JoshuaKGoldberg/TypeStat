import { TypeStatOptions } from "../../../options/types";
import { runCommand } from "./runCommand";

export const installWithYarn = async (options: TypeStatOptions, missingPackageNames: ReadonlyArray<string>) => {
    await runCommand(
        options,
        ["yarn", "add", ...Array.from(missingPackageNames).map((packageName) => `@types/${packageName}`), "-D"].join(" "),
    );
};
