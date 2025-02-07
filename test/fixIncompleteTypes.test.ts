import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("Incomplete types", () => {
	describe("Implicit generics", () => {
		it("incomplete implicit class generics", async () => {
			expect.assertions(3);
			await checkTestResult(
				cwd,
				"fixes/incompleteTypes/implicitGenerics/incompleteImplicitClassGenerics",
			);
		}, 50000);

		it("incomplete implicit variable generics", async () => {
			expect.assertions(3);
			await checkTestResult(
				cwd,
				"fixes/incompleteTypes/implicitGenerics/incompleteImplicitVariableGenerics",
			);
		}, 50000);
	});

	it("Interface or type literal generics", async () => {
		expect.assertions(3);
		await checkTestResult(
			cwd,
			"fixes/incompleteTypes/interfaceOrTypeLiteralGenerics",
		);
	}, 50000);

	it("Non-generic Interface as Type argument", async () => {
		expect.assertions(3);
		await checkTestResult(
			cwd,
			"fixes/incompleteTypes/nonGenericInterfaceAsTypeArgument",
		);
	}, 50000);

	it("parameter types", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/incompleteTypes/parameterTypes");
	});

	it("property declaration types", async () => {
		expect.assertions(3);
		await checkTestResult(
			cwd,
			"fixes/incompleteTypes/propertyDeclarationTypes",
		);
	}, 50000);

	describe("React types", () => {
		it("not react props", async () => {
			expect.assertions(3);
			await checkTestResult(
				cwd,
				"fixes/incompleteTypes/reactTypes/notReactProps",
			);
		});

		it("react prop functions from calls", async () => {
			expect.assertions(3);
			await checkTestResult(
				cwd,
				"fixes/incompleteTypes/reactTypes/reactPropFunctionsFromCalls",
			);
		}, 50000);

		it("react props from later assignments", async () => {
			expect.assertions(3);
			await checkTestResult(
				cwd,
				"fixes/incompleteTypes/reactTypes/reactPropsFromLaterAssignments",
			);
		}, 50000);

		describe("React props from prop types", () => {
			it("all", async () => {
				expect.assertions(3);
				await checkTestResult(
					cwd,
					"fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/all",
				);
			}, 50000);

			describe("Optionality", () => {
				it("always optional", async () => {
					expect.assertions(3);
					await checkTestResult(
						cwd,
						"fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/optionality/alwaysOptional",
					);
				});

				it("always required", async () => {
					expect.assertions(3);
					await checkTestResult(
						cwd,
						"fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/optionality/alwaysRequired",
					);
				});

				it("as written", async () => {
					expect.assertions(3);
					await checkTestResult(
						cwd,
						"fixes/incompleteTypes/reactTypes/reactPropsFromPropTypes/optionality/asWritten",
					);
				});
			});
		});

		it("react props from prop uses", async () => {
			expect.assertions(3);
			await checkTestResult(
				cwd,
				"fixes/incompleteTypes/reactTypes/reactPropsFromUses",
			);
		});

		it("react props missing", async () => {
			expect.assertions(3);
			await checkTestResult(
				cwd,
				"fixes/incompleteTypes/reactTypes/reactPropsMissing",
			);
		});
	});

	it("return types", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/incompleteTypes/returnTypes");
	});

	it("variable types", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/incompleteTypes/variableTypes");
	});
});
