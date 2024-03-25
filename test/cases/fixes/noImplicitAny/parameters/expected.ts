(function () {
	function givenStringTypeLater(abc: string): void {
		console.log(abc);
	}

	givenStringTypeLater("");

	function givenStringOrNullTypeLater(abc: string | null): void {
		console.log(abc);
	}

	givenStringOrNullTypeLater("" as string | null);

	function givenStringOrNullOnStringTypeLater(abc: string): void {
		console.log(abc);
	}

	givenStringOrNullOnStringTypeLater("" as string | null);

	function givenStringOrUndefinedOnStringTypeLater(abc: string): void {
		console.log(abc);
	}

	givenStringOrUndefinedOnStringTypeLater("" as string | undefined);

	function givenNullTypeLater(abc): void {
		console.log(abc);
	}

	givenNullTypeLater(null);

	function givenUndefinedTypeLater(abc: undefined): void {
		console.log(abc);
	}

	givenUndefinedTypeLater(undefined);

	function givenAnyTypeLater(abc): void {
		console.log(abc);
	}

	givenAnyTypeLater({} as any);

	function givenEmptyObjectLiteralTypeLater(abc): void {
		console.log(abc);
	}

	givenEmptyObjectLiteralTypeLater({});

	function givenObjectTypeLater(abc): void {
		console.log(abc);
	}

	givenObjectTypeLater({} as Object);

	["notGivenInferableType"].filter((char) => console.log(char));

	["notGivenInferableTypes"].forEach((char, index) => {
		console.log(char, index);
	});

	const needsWrapping = (count: number) => `${count}lbs`;
	needsWrapping(1.234567);

	const needsNoWrapping = (count: number) => `${count}lbs`;
	needsNoWrapping(1.234567);
})();
