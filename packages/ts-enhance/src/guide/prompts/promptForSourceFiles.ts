import { prompt } from "enquirer";

const everything = "everything";
const other = "other";

const completion = "/**/*.{ts,tsx}";

export const promptForSourceFiles = async () => {
	const builtIn = await promptForBuiltInSourceFiles();

	if (builtIn === other) {
		return await promptForCustomSourceFiles();
	}

	if (builtIn === everything) {
		return undefined;
	}

	return builtIn;
};

const promptForBuiltInSourceFiles = async () => {
	// https://github.com/enquirer/enquirer/issues/202
	const choices: string[] = [
		{
			message: "everything in my tsconfig.json",
			name: everything,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any,
		`src${completion}`,
		other,
	];

	const { sourceFiles } = await prompt<{ sourceFiles: string }>([
		{
			choices,
			initial: choices.length - 1,
			message: "Which glob matches files you'd like to convert?",
			name: "sourceFiles",
			type: "select",
		},
	]);

	return sourceFiles;
};

const promptForCustomSourceFiles = async () => {
	const { sourceFiles } = await prompt<{ sourceFiles: string }>([
		{
			initial: `src${completion}`,
			message: "Which files would you like to convert?",
			name: "sourceFiles",
			type: "text",
		},
	]);

	return sourceFiles;
};
