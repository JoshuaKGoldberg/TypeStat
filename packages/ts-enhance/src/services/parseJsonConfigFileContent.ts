import minimatch from "minimatch";
import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";

export const parseJsonConfigFileContent = (
	config: unknown,
	cwd: string,
	existingOptions?: ts.CompilerOptions,
) => {
	return ts.parseJsonConfigFileContent(
		config,
		{
			fileExists: (filePath) => fs.statSync(filePath).isFile(),
			readDirectory: (rootDir, extensions, excludes, includes) =>
				includes
					.flatMap((include) =>
						fs
							.readdirSync(path.join(rootDir, include))
							.map((fileName) => path.join(rootDir, include, fileName)),
					)
					.filter(
						(filePath) =>
							!excludes?.some((exclude) => minimatch(filePath, exclude)) &&
							extensions.some((extension) => filePath.endsWith(extension)),
					)
					.map((filePath) => path.relative(rootDir, filePath)),
			readFile: (filePath) => fs.readFileSync(filePath).toString(),
			useCaseSensitiveFileNames: true,
		},
		cwd,
		existingOptions,
	);
};
