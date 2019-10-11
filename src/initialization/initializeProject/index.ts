import { prompt } from "enquirer";

const custom = "custom",
    choices = ["./tsconfig.json", "./src/tsconfig.json", custom];

export const initializeProject = async () => {
    const project = await initializeBuiltInProject();

    return project === custom ? initializeCustomProject() : project;
};

const initializeBuiltInProject = async () => {
        const { project } = await prompt([
            {
                choices,
                initial: choices[choices.length - 1],
                message: "Where is your tsconfig.json?",
                name: "project",
                type: "select",
            },
        ]);

        return project as string;
    },
    initializeCustomProject = async () => {
        const { project } = await prompt([
            {
                initial: "./tsconfig.json",
                message: "Where is your tsconfig.json?",
                name: "project",
                type: "text",
            },
        ]);

        return project as string;
    };
