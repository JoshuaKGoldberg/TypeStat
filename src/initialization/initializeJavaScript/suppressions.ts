import { prompt } from "enquirer";

export enum InitializationSuppressions {
    No = "No",
    Yes = "Yes",
}

export const initializeSuppressions = async () => {
    const { suppressions } = await prompt<{ suppressions: InitializationSuppressions }>([
        {
            choices: [InitializationSuppressions.No, InitializationSuppressions.Yes],
            initial: 1,
            message: "Would you like to suppress remaining type errors with // @ts-expect-error comments?",
            name: "suppressions",
            type: "select",
        },
    ]);

    return suppressions;
};
