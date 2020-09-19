import { prompt } from "enquirer";

export enum InitializationImprovement {
    NoImplicitAny = "Enable the --noImplicitAny compiler flag",
    NoImplicitThis = "Enable the --noImplicitThis compiler flag",
    NoInferableTypes = "Remove type annotations that don't change the meaning of code",
    StrictNullChecks = "Enable the --strictNullChecks compiler flag",
}

export const initializeImprovements = async () => {
    const choices = [
        InitializationImprovement.NoImplicitAny,
        InitializationImprovement.NoImplicitThis,
        InitializationImprovement.NoInferableTypes,
        InitializationImprovement.StrictNullChecks,
    ];

    const { improvements } = await prompt<{ improvements: InitializationImprovement[] }>([
        {
            choices,
            initial: 0,
            message: "Which improvements would you like to make?",
            name: "improvements",
            type: "multiselect",
        },
    ]);

    return improvements;
};
