import { prompt } from "enquirer";

export enum InitializationRenames {
	Auto = "Rename files containing JSX to .tsx and others to .ts",
	TS = "Rename all files to .ts",
	TSX = "Rename all files to .tsx",
}

export const initializeRenames = async () => {
	const { renames } = await prompt<{ renames: InitializationRenames }>([
		{
			choices: [
				InitializationRenames.Auto,
				InitializationRenames.TS,
				InitializationRenames.TSX,
			],
			initial: 0,
			message: "How would you like .js files to be renamed?",
			name: "renames",
			type: "select",
		},
	]);

	return renames;
};
