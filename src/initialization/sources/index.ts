import { prompt } from "enquirer";

export interface InitializeSourcesSettings {
    fromJavaScript: boolean;
}

const everything = "everything";
const other = "other";

export const initializeSources = async (settings: InitializeSourcesSettings) => {
    const completion = settings.fromJavaScript ? "/**/*.{js,jsx}" : "/**/*.{ts,tsx}";
    const builtIn = await initializeBuiltInSources(completion);

    if (builtIn === other) {
        return await getCustomSources(completion);
    }

    if (builtIn === everything) {
        return undefined;
    }

    return builtIn;
};

const initializeBuiltInSources = async (completion: string) => {
    // https://github.com/enquirer/enquirer/issues/202
    const choices: string[] = [
        {
            message: "everything in my tsconfig.json",
            name: everything,
        } as any,
        `lib${completion}`,
        `src${completion}`,
        other,
    ];

    const { sourceFiles } = await prompt([
        {
            choices,
            initial: choices[choices.length - 1],
            message: "Which glob matches files you'd like to convert?",
            name: "sourceFiles",
            type: "select",
        },
    ]);

    return sourceFiles as string;
};

const getCustomSources = async (completion: string) => {
    const { sourceFiles } = await prompt([
        {
            initial: `src${completion}`,
            message: "Which files would you like to convert?",
            name: "sourceFiles",
            type: "text",
        },
    ]);

    return sourceFiles as string;
};
