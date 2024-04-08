import { query } from "@phenomnomnominal/tsquery";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { createSourceFileAndTypeChecker } from "../../../../tests/utils.js";
import { collectReturningNodeExpressions } from "./collectReturningNodeExpressions.js";

describe("collectReturningNodeExpressions", () => {
	it("should collect files with wildcard", async () => {
		const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(`
            async function navigateTo(): Promise<boolean> {
                return await new Promise(() => {});
            }
        `);

		const [functionLikeDeclaration] = query<ts.FunctionLikeDeclaration>(
			sourceFile,
			"FunctionDeclaration",
		);

		const result = collectReturningNodeExpressions(functionLikeDeclaration);
		const types = result.map((res) =>
			typeChecker.typeToString(typeChecker.getTypeAtLocation(res)),
		);
		expect(types).toStrictEqual(["boolean"]);
	});
});
