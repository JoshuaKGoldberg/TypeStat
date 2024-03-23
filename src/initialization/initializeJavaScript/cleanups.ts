import { prompt } from "enquirer";

export enum InitializationCleanups {
	No = "No",
	Yes = "Yes",
}

export const initializeCleanups = async () => {
	const { cleanups } = await prompt<{ cleanups: InitializationCleanups }>([
		{
			choices: [InitializationCleanups.No, InitializationCleanups.Yes],
			initial: 1,
			message:
				"Would you like to suppress remaining type errors with // @ts-expect-error comments?",
			name: "cleanups",
			type: "select",
		},
	]);

	return cleanups;
};
