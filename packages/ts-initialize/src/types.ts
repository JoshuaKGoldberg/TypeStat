import { ProcessOutput } from "typestat-utils";

export enum FileExtensions {
	AsNeeded = "as-needed",
	TS = "ts",
	TSX = "tsx",
}

export enum PackageManager {
	Npm = "npm",
	Yarn = "yarn",
}

export enum TSConfigJSX {
	None = "none",
	Preserve = "preserve",
	React = "react",
}

export enum TSConfigEmit {
	Dist = "dist",
	Lib = "lib",
	None = "none",
	Sibling = "sibling",
}

export enum TSConfigModuleResolution {
	Bundler = "bundler",
	Node = "Node",
}

export enum TSConfigTarget {
	ES2020 = "ES2020",
	ES2021 = "ES2021",
	ES2022 = "ES2022",
	ESNext = "ESNext",
}

export interface TSInitializeTSConfig {
	dom: boolean;
	emit: TSConfigEmit;
	jsx: TSConfigJSX;
	moduleResolution: TSConfigModuleResolution;
	target: TSConfigTarget;
}

export interface TSInitializeOptions {
	cwd: string;
	fileExtensions: FileExtensions;
	filePaths: readonly string[];
	output: ProcessOutput;
	packageManager: PackageManager;
	tsconfig: TSInitializeTSConfig;
}
