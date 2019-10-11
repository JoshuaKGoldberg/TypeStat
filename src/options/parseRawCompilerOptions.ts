import * as fs from "mz/fs";
import * as ts from "typescript";

export const parseRawCompilerOptions = async (projectPath: string): Promise<ts.CompilerOptions> => {
    const configRaw = (await fs.readFile(projectPath)).toString(),
        compilerOptions = ts.parseConfigFileTextToJson(projectPath, configRaw);
    if (compilerOptions.error !== undefined) {
        throw new Error(`Could not parse compiler options from '${projectPath}': ${compilerOptions.error}`);
    }

    return compilerOptions.config as ts.CompilerOptions;
};
