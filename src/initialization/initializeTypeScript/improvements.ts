import { prompt } from "enquirer";

export enum InitializationImprovement {
    ExtraneousTypes = "Remove extraneous (unnecessary) types",
    NoImplicitAny = "Enable the --noImplicitAny compiler flag",
    NoImplicitThis = "Enable the --noImplicitThis compiler flag",
    StrictNullChecks = "Enable the --strictNullChecks compiler flag",
}

export const initializeImprovements = async () => {
    const choices = [
        InitializationImprovement.ExtraneousTypes,
        InitializationImprovement.NoImplicitAny,
        InitializationImprovement.NoImplicitThis,
        InitializationImprovement.StrictNullChecks,
    ];

    const { improvements } = await prompt([
        {
            choices,
            initial: choices,
            message: "Which improvements would you like to make?",
            name: "improvements",
            type: "multiselect",
        },
    ]);

    return improvements as InitializationImprovement[];
};
