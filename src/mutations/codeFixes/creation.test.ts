import ts from "typescript";
import { describe, expect, it } from "vitest";

import { simplifyTextChanges } from "./creation.js";

describe("simplifyTextChanges", () => {
	it("should not mangle two changes together", () => {
		// This example is from https://github.com/JoshuaKGoldberg/TypeStat/issues/256
		const changes: ts.TextChange[] = [
			{
				newText: "(",
				span: {
					length: 0,
					start: 1405,
				},
			},
			{
				newText: ": number",
				span: {
					length: 0,
					start: 1411,
				},
			},
			{
				newText: ")",
				span: {
					length: 0,
					start: 1411,
				},
			},
		];

		const result = simplifyTextChanges(changes);
		expect(result).toStrictEqual([
			{
				newText: "(",
				span: {
					length: 0,
					start: 1405,
				},
			},
			{
				newText: ": number)",
				span: {
					length: 0,
					start: 1411,
				},
			},
		]);
	});
});
