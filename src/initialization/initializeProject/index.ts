import { prompt } from "enquirer";

const custom = "custom";

const choices = ["./tsconfig.json", "./src/tsconfig.json", custom];

export const initializeProject = async () => {
    const project = await initializeBuiltInProject();

    return project === custom ? initializeCustomProject() : project;
};

const initializeBuiltInProject = async () => {
    const { project } = await prompt<{ project: string }>([
        {
            choices,
            initial: choices.length - 1,
            message: "Where is your tsconfig.json?",
            name: "project",
            type: "select",
        },
    ]);

    return project;
};

const initializeCustomProject = async () => {
    const { project } = await prompt<{ project: string }>([
        {
            initial: "./tsconfig.json",
            message: "Where is your tsconfig.json?",
            name: "project",
            type: "text",
        },
    ]);

    return project;
};
