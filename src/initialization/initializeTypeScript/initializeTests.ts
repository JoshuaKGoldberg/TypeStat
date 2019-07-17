import { prompt } from "enquirer";

export const initializeTests = async () => {
    const choices = [
        `lib/**/__tests__/*.test.{ts,tsx}`,
        `lib/**/*.test.{ts,tsx}`,
        `src/**/__tests__/*.test.{ts,tsx}`,
        `src/**/*.test.{ts,tsx}`,
        `test/**/*.{ts,tsx}`,
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
