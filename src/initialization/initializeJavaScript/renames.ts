import { prompt } from "enquirer";

export enum InitializationRenames {
    Auto = "Rename files containing JSX to .tsx and others to .ts",
    TS = "Rename all files to .ts",
    TSX = "Rename all files to .tsx",
}

export const initializeRenames = async () => {
    const { renames } = await prompt([
        {
            choices: [InitializationRenames.Auto, InitializationRenames.TS, InitializationRenames.TS],
            initial: InitializationRenames.Auto,
            message: "How would you like .js files to be renamed?",
            name: "renames",
            type: "select",
        },
    ]);

    return renames as InitializationRenames;
};
