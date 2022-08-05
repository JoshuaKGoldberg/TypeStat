import minimatch from "minimatch";
import * as fs from "mz/fs";
import * as path from "path";
import * as ts from "typescript";

export const parseJsonConfigFileContent = (config: unknown, cwd: string, existingOptions?: ts.CompilerOptions) => {
    return ts.parseJsonConfigFileContent(
        config,
        {
            useCaseSensitiveFileNames: true,
            readDirectory: (rootDir, extensions, excludes, includes) =>
                includes
                    .flatMap((include) =>
                        fs.readdirSync(path.join(rootDir, include)).map((fileName) => path.join(rootDir, include, fileName)),
                    )
                    .filter(
                        (filePath) =>
                            !excludes?.some((exclude) => minimatch(filePath, exclude)) &&
                            extensions.some((extension) => filePath.endsWith(extension)),
                    )
                    .map((filePath) => path.relative(rootDir, filePath)),
            fileExists: (filePath) => fs.statSync(filePath).isFile(),
            readFile: (filePath) => fs.readFileSync(filePath).toString(),
        },
        cwd,
        existingOptions,
    );
};
