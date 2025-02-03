import { describe, expect, it } from "vitest";

import {
	TypeStatCompilerOptions,
	TypeStatOptions,
} from "../../../options/types.js";
import { createLanguageServices } from "../../../services/language.js";
import { collectReferencedPackageNames } from "./collectReferencedPackageNames.js";

describe("collectReferencedPackageNames", () => {
	it.skip("should return package names", () => {
		const options: Partial<TypeStatOptions> = {
			compilerOptions: {} as Readonly<TypeStatCompilerOptions>,
			package: {
				directory: process.cwd(),
				file: "package.json",
				missingTypes: true,
			},
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
		const options: Partial<TypeStatOptions> = {
			compilerOptions: {} as Readonly<TypeStatCompilerOptions>,
			package: {
				directory: process.cwd(),
				file: "package.json",
				missingTypes: true,
			},
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
