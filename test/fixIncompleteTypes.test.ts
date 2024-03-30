import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

const dirname = import.meta.dirname;

describe("Incomplete types", () => {
	describe("Implicit generics", () => {
		it("incomplete implicit class generics", async () => {
			const caseDir = path.join(
				dirname,
				"cases/fixes/incompleteTypes/implicitGenerics/incompleteImplicitClassGenerics",
			);
			const { actualContent, expectedFilePath } =
				await runMutationTest(caseDir);
			await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		}, 50000);

		it("incomplete implicit variable generics", async () => {
			const caseDir = path.join(
				dirname,
				"cases/fixes/incompleteTypes/implicitGenerics/incompleteImplicitVariableGenerics",
			);
			const { actualContent, expectedFilePath } =
				await runMutationTest(caseDir);
			await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		});
	});

	it("Interface or type literal generics", async () => {
		const caseDir = path.join(
			dirname,
			"cases/fixes/incompleteTypes/interfaceOrTypeLiteralGenerics",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	}, 50000);

	it("parameter types", async () => {
		const caseDir = path.join(
			dirname,
			"cases/fixes/incompleteTypes/parameterTypes",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("property declaration types", async () => {
		const caseDir = path.join(
			dirname,
			"cases/fixes/incompleteTypes/propertyDeclarationTypes",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	describe("React types", () => {
		it("not react props", async () => {
			const caseDir = path.join(
				dirname,
				"cases/fixes/incompleteTypes/reactTypes/notReactProps",
			);
			const { actualContent, expectedFilePath } =
				await runMutationTest(caseDir);
			await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		});

		it("react prop functions from calls", async () => {
			const caseDir = path.join(
				dirname,
				"cases/fixes/incompleteTypes/reactTypes/reactPropFunctionsFromCalls",
			);
			const { actualContent, expectedFilePath } =
				await runMutationTest(caseDir);
			await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		}, 50000);

		it("react props from later assignments", async () => {
			const caseDir = path.join(
				dirname,
				"cases/fixes/incompleteTypes/reactTypes/reactPropsFromLaterAssignments",
			);
			const { actualContent, expectedFilePath } =
				await runMutationTest(caseDir);
			await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		}, 50000);

		describe("React props from prop types", () => {
			it("all", async () => {
				const caseDir = path.join(
					dirname,
					"cases/fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/all",
				);
				const { actualContent, expectedFilePath } =
					await runMutationTest(caseDir);
				await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
			}, 50000);

			describe("Optionality", () => {
				it("always optional", async () => {
					const caseDir = path.join(
						dirname,
						"cases/fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/optionality/alwaysOptional",
					);
					const { actualContent, expectedFilePath } =
						await runMutationTest(caseDir);
					await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
				});

				it("always required", async () => {
					const caseDir = path.join(
						dirname,
						"cases/fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/optionality/alwaysRequired",
					);
					const { actualContent, expectedFilePath } =
						await runMutationTest(caseDir);
					await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
				});

				it("as written", async () => {
					const caseDir = path.join(
						dirname,
						"cases/fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/optionality/asWritten",
					);
					const { actualContent, expectedFilePath } =
						await runMutationTest(caseDir);
					await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
				});
			});
		});

		it("react props from prop uses", async () => {
			const caseDir = path.join(
				dirname,
				"cases/fixes/incompleteTypes/reactTypes/reactPropsFromUses",
			);
			const { actualContent, expectedFilePath } =
				await runMutationTest(caseDir);
			await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		});

		it("react props missing", async () => {
			const caseDir = path.join(
				dirname,
				"cases/fixes/incompleteTypes/reactTypes/reactPropsMissing",
			);
			const { actualContent, expectedFilePath } =
				await runMutationTest(caseDir);
			await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		});
	});

	it("return types", async () => {
		const caseDir = path.join(
			dirname,
			"cases/fixes/incompleteTypes/returnTypes",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("variable types", async () => {
		const caseDir = path.join(
			dirname,
			"cases/fixes/incompleteTypes/variableTypes",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});
});
