import { describe, expect, it } from "vitest";

import { NameGenerator } from "./NameGenerator.js";

describe("NameGenerator", () => {
	it("creates a basic name when the base portion hasn't been requested yet", () => {
		// Arrange
		const sourceFileName = "File";
		const nameGenerator = new NameGenerator(sourceFileName);

		// Act
		const name = nameGenerator.generateName("Base");

		// Assert
		expect(name).toEqual("FileBase");
	});

	it("creates a 1-suffixed name when the base portion has been requested once", () => {
		// Arrange
		const sourceFileName = "File";
		const nameGenerator = new NameGenerator(sourceFileName);
		nameGenerator.generateName("Base");

		// Act
		const name = nameGenerator.generateName("Base");

		// Assert
		expect(name).toEqual("FileBase2");
	});

	it("creates 2-suffixed name when the base portion has been requested twice", () => {
		// Arrange
		const sourceFileName = "File";
		const nameGenerator = new NameGenerator(sourceFileName);
		nameGenerator.generateName("Base");
		nameGenerator.generateName("Base");

		// Act
		const name = nameGenerator.generateName("Base");

		// Assert
		expect(name).toEqual("FileBase3");
	});
});
