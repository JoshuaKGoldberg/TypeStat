import { prompt } from "enquirer";

const other = "other";

export const initializeTests = async () => {
    const builtIn = await initializeBuiltInTests();

    return builtIn === other ? getCustomTests() : builtIn;
};

const initializeBuiltInTests = async () => {
        const choices = [
                "lib/**/__tests__/*.test.{ts,tsx}",
                "lib/**/*.test.{ts,tsx}",
                "src/**/__tests__/*.test.{ts,tsx}",
                "src/**/*.test.{ts,tsx}",
                "test/**/*.{ts,tsx}",
            ],
            { testFiles } = await prompt([
                {
                    choices,
                    initial: choices[choices.length - 1],
                    message: "Which glob matches your test files?",
                    name: "testFiles",
                    type: "select",
                },
            ]);

        return testFiles as string;
    },
    getCustomTests = async () => {
        const { testFiles } = await prompt([
            {
                initial: "test/**/*.{ts,tsx}",
                message: "Where are your test files?",
                name: "testFiles",
                type: "text",
            },
        ]);

        return testFiles as string;
    };
