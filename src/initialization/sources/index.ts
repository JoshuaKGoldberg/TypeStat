import { prompt } from "enquirer";

export interface InitializeSourcesSettings {
    fromJavaScript: boolean;
}

export const initializeSources = async (settings: InitializeSourcesSettings) => {
    const originalExtension = settings.fromJavaScript ? "js" : "ts";

    const choices = [
        `lib/**/*.${originalExtension}`,
        `lib/**/*.${originalExtension}(x)`,
        `src/**/*.${originalExtension}`,
        `src/**/*.${originalExtension}(x)`,
    ];

    const { sourceFiles } = await prompt([
        {
            choices,
            initial: choices[choices.length - 1],
            message: "Which grep matches your source files?",
            name: "sourceFiles",
            type: "select",
        },
    ]);

    return sourceFiles as string;
};
