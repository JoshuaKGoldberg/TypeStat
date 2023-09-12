import * as fs from "node:fs/promises";
import path from "node:path";

import {
	TSConfigEmit,
	TSConfigJSX,
	TSConfigModuleResolution,
	TSInitializeOptions,
} from "../../types.js";

export const createTSConfig = async (options: TSInitializeOptions) => {
	const moduleResolution =
		options.tsconfig.moduleResolution === TSConfigModuleResolution.Node
			? "NodeNext"
			: options.tsconfig.moduleResolution;

	await fs.writeFile(
		path.join(options.cwd, "tsconfig.json"),
		JSON.stringify(
			{
				compilerOptions: {
					declaration: true,
					declarationMap: true,
					...(options.tsconfig.emit === TSConfigEmit.None
						? { noEmit: true }
						: { outDir: options.tsconfig.emit }),
					esModuleInterop: true,
					...(!options.tsconfig.dom && { lib: [options.tsconfig.target] }),
					...(options.tsconfig.jsx !== TSConfigJSX.None && {
						jsx: options.tsconfig.jsx,
					}),
					module: moduleResolution,
					moduleResolution: moduleResolution,
					skipLibCheck: true,
					sourceMap: true,
					target: options.tsconfig.target,
				},
				include: ["src"],
			},
			null,
			4,
		),
	);
};
