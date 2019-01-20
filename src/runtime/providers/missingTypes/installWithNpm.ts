import { TypeStatOptions } from "../../../options/types";
import { runCommand } from "./runCommand";

export const installWithNpm = async (
    options: TypeStatOptions,
    missingPackageNames: ReadonlyArray<string>) => {
        console.log({ missingPackageNames });
        console.log(missingPackageNames.map(p => `@types/${p}`));
        console.log(missingPackageNames.map(p => `@types/${p}`).join(""));
    await runCommand(
        options,
        [
            "npm",
            "install",
            ...Array.from(missingPackageNames)
                .map((packageName) => `@types/${packageName}`),
            "-D",
        ].join(" "),
    ); 
};
