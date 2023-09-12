import { prompt } from "enquirer";

export enum InitializationFix {
	MissingProperties = "Add missing property declarations to classes",
	NoImplicitAny = "Enable the --noImplicitAny compiler flag",
	NoImplicitThis = "Enable the --noImplicitThis compiler flag",
	NoInferableTypes = "Remove type annotations that don't change the meaning of code",
	StrictNullChecks = "Enable the --strictNullChecks compiler flag",
}

export const promptForFixes = async () => {
	const choices = [
		InitializationFix.MissingProperties,
		InitializationFix.NoImplicitAny,
		InitializationFix.NoImplicitThis,
		InitializationFix.NoInferableTypes,
		InitializationFix.StrictNullChecks,
	];

	const { improvements } = await prompt<{
		improvements: InitializationFix[];
	}>([
		{
			choices,
			initial: 0,
			message: "Which fixes would you like to make?",
			name: "improvements",
			type: "multiselect",
		},
	]);

	return improvements;
};
