import { prompt } from "enquirer";

export const initializeTests = async () => {
    const choices = [
        `lib/**/__tests__/*.test.ts(x)`,
        `lib/**/*.test.ts(x)`,
        `src/**/__tests__/*.test.ts(x)`,
        `src/**/*.test.ts(x)`,
        `test/**/*.ts(x)`,
    ];

    const { testFiles } = await prompt([
        {
            choices,
            initial: choices[choices.length - 2],
            message: "Which grep matches your test files?",
            name: "testFiles",
            type: "select",
        },
    ]);

    return testFiles as string;
};
