import { describe, expect, it } from "vitest";

import { parseRawCompilerOptions } from "../../../options/parseRawCompilerOptions.js";
import { TypeStatOptions } from "../../../options/types.js";
import { createLanguageServices } from "../../../services/language.js";
import { collectReferencedPackageNames } from "./collectReferencedPackageNames.js";

describe("collectReferencedPackageNames", () => {
	it("should return package names", () => {
		const cwd = process.cwd();
		const parsedTsConfig = parseRawCompilerOptions(cwd, "tsconfig.json");
		const options: Partial<TypeStatOptions> = {
			package: {
				directory: process.cwd(),
				file: "package.json",
				missingTypes: true,
			},
			parsedTsConfig,
			projectPath: "tsconfig.json",
		};
		const services = createLanguageServices(options as TypeStatOptions);

		const packageNames = collectReferencedPackageNames(
			services,
			new Set<string>(),
		);

		expect(Array.from(packageNames)).toStrictEqual(["node", "automutate"]);
	});

	it("should ignore defined package names", () => {
		const cwd = process.cwd();
		const parsedTsConfig = parseRawCompilerOptions(cwd, "tsconfig.json");
		const options: Partial<TypeStatOptions> = {
			package: {
				directory: process.cwd(),
				file: "package.json",
				missingTypes: true,
			},
			parsedTsConfig,
			projectPath: "tsconfig.json",
		};
		const services = createLanguageServices(options as TypeStatOptions);

		const packageNames = collectReferencedPackageNames(
			services,
			new Set<string>(["automutate"]),
		);

		expect(Array.from(packageNames)).toStrictEqual(["node"]);
	});
});
