import { fs } from "mz";

import { TypeStatOptions } from "../../../options/types";
import { getQuickErrorSummary } from "../../../shared/errors";

export const collectExistingTypingPackages = async (options: TypeStatOptions, packagePath: string) => {
    const allDependencies = await tryCollectAllDependencies(packagePath);
    if (typeof allDependencies === "string") {
        options.logger.stderr.write(`\nError trying to collect existing dependencies for --packageMissingTypes:\n\t`);
        options.logger.stderr.write(allDependencies);
        options.logger.stderr.write("\n\n");
        return undefined;
    }

    return Array.from(allDependencies)
        .filter((dependency) => dependency.startsWith("@types/"))
        .map((dependency) => dependency.substring("@types/".length));
};

const tryCollectAllDependencies = async (packagePath: string) => {
        try {
            return collectAllDependencies(packagePath);
        } catch (error) {
            return getQuickErrorSummary(error);
        }
    },
    collectAllDependencies = async (packagePath: string) => {
        const rawContents = (await fs.readFile(packagePath)).toString(),
            parsedContents = JSON.parse(rawContents) as { [i: string]: { [i: string]: string } | undefined },
            allDependencies: string[] = [];

        for (const groupName of ["dependencies", "devDependencies", "peerDependencies"]) {
            const packageObject = parsedContents[groupName];

            if (packageObject !== undefined) {
                allDependencies.push(...Object.keys(packageObject));
            }
        }

        return new Set(allDependencies);
    };
