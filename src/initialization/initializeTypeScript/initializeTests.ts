import enquirer from "enquirer";

const other = "other";
const none = "(none)";

export const initializeTests = async () => {
	const builtIn = await initializeBuiltInTests();

	if (builtIn === none) {
		return;
	}

	return builtIn === other ? getCustomTests() : builtIn;
};

const initializeBuiltInTests = async () => {
	const choices = [
		"lib/**/__tests__/*.test.{ts,tsx}",
		"lib/**/*.test.{ts,tsx}",
		"src/**/__tests__/*.test.{ts,tsx}",
		"src/**/*.test.{ts,tsx}",
		"test/**/*.{ts,tsx}",
		none,
	];

	const { testFiles } = await enquirer.prompt<{ testFiles: string }>([
		{
			choices,
			initial: choices.length - 1,
			message: "Which glob matches your test files?",
			name: "testFiles",
			type: "select",
		},
	]);

	return testFiles;
};

const getCustomTests = async () => {
	const { testFiles } = await enquirer.prompt<{ testFiles: string }>([
		{
			initial: "test/**/*.{ts,tsx}",
			message: "Where are your test files?",
			name: "testFiles",
			type: "text",
		},
	]);

	return testFiles;
};
