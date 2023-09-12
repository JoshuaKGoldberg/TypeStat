import { describe, expect, it, vi } from "vitest";

import { FileExtensions } from "../../types.js";
import { getNewFileName } from "./getNewFileName.js";

describe(getNewFileName, () => {
	it("returns a .ts path when renameExtensions is ts", async () => {
		const actual = await getNewFileName(
			FileExtensions.TS,
			"path/name.js",
			vi.fn(),
		);

		expect(actual).toBe("path/name.ts");
	});

	it("returns a .tsx path when renameExtensions is tsx", async () => {
		const actual = await getNewFileName(
			FileExtensions.TSX,
			"path/name.js",
			vi.fn(),
		);

		expect(actual).toBe("path/name.tsx");
	});

	it.each([
		{ extension: ".ts", name: "no closing tags", text: "<>" },
		{ extension: ".tsx", name: "an intrinsic closing tag", text: "< /div >" },
		{
			extension: ".tsx",
			name: "a custom closing tag",
			text: "< /Custom.Tag >",
		},
		{ extension: ".tsx", name: "a fragment closing tag", text: "</>" },
		{ extension: ".tsx", name: "a self closing tag", text: "/>" },
	])(
		"returns a $extension path when renameExtensions is as-needed and the file contains $name",
		async ({ extension, text }) => {
			const actual = await getNewFileName(
				FileExtensions.AsNeeded,
				"path/name.js",
				vi.fn().mockResolvedValue(`
            		${text}
            	`),
			);

			expect(actual).toBe(`path/name${extension}`);
		},
	);
});
