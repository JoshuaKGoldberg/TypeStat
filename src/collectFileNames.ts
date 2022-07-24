import * as path from "path";

import { TypeStatArgv } from "./index";
import { globAllAsync } from "./shared/glob";

export const collectFileNames = async (
    argv: TypeStatArgv,
    cwd: string,
    include: ReadonlyArray<string> | undefined,
): Promise<ReadonlyArray<string> | string | undefined> => {
    const globsAndNames = await collectFileNamesFromGlobs(argv, cwd, include);
    if (!globsAndNames) {
        return undefined;
    }

    const [fileGlobs, fileNames] = globsAndNames;
    const implicitNodeModulesInclude = implicitNodeModulesIncluded(fileGlobs, fileNames);

    if (implicitNodeModulesInclude) {
        return `At least one path including node_modules was included implicitly: '${implicitNodeModulesInclude}'. Either adjust TypeStat's included files to not include node_modules (recommended) or explicitly include node_modules/ (not recommended).`;
    }

    return fileNames;
};

const collectFileNamesFromGlobs = async (
    argv: TypeStatArgv,
    cwd: string,
    include: ReadonlyArray<string> | undefined,
): Promise<[ReadonlyArray<string>, ReadonlyArray<string>] | undefined> => {
    if (argv.args !== undefined && argv.args.length !== 0) {
        return [argv.args, await globAllAsync(argv.args)];
    }

    if (include === undefined) {
        return undefined;
    }

    return [include, await globAllAsync(include.map((subInclude) => path.join(cwd, subInclude)))];
};

const implicitNodeModulesIncluded = (fileGlobs: ReadonlyArray<string>, fileNames: ReadonlyArray<string> | undefined) => {
    return !fileGlobs.some((glob) => glob.includes("node_modules")) && fileNames?.find((fileName) => fileName.includes("node_modules"));
};
