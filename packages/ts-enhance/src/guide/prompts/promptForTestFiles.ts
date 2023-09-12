import { prompt } from "enquirer";

const other = "other";
const none = "(none)";

export const promptForTestFiles = async () => {
	const builtIn = await initializeBuiltInTestFiles();
	if (builtIn === none) {
		return;
	}

	return builtIn === other ? getCustomTestFiles() : builtIn;
};

const initializeBuiltInTestFiles = async () => {
	const choices = [
		"src/**/__tests__/*.test.{ts,tsx}",
		"src/**/*.test.{ts,tsx}",
		"test/**/*.{ts,tsx}",
		none,
	];

	const { testFiles } = await prompt<{ testFiles: string }>([
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

const getCustomTestFiles = async () => {
	const { testFiles } = await prompt<{ testFiles: string }>([
		{
			initial: "test/**/*.{ts,tsx}",
			message: "Where are your test files?",
			name: "testFiles",
			type: "text",
		},
	]);

	return testFiles;
};
