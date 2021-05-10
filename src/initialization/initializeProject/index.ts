import { prompt } from "enquirer";
import * as fs from "fs";

import { uniquify } from "../../shared/arrays";
import { globAllAsync } from "../../shared/glob";

const custom = "custom";

const defaultChoices = ["./tsconfig.json", "./src/tsconfig.json", custom];

const defaultSettings = {
    message: "Where is your tsconfig.json?",
    name: "project",
};

export const initializeProject = async () => {
    const project = await initializeBuiltInProject();

    return project === custom ? initializeCustomProject() : project;
};

const initializeBuiltInProject = async () => {
    const choices = [
        ...uniquify(
            "./tsconfig.json",
            ...await globAllAsync(["./tsconfig*json", "./*/tsconfig*json"])
        ),
        custom,
    ];

    const { project } = await prompt<{ project: string }>([
        {
            ...defaultSettings,
            choices,
            initial: choices.findIndex(choice => fs.existsSync(choice)) ?? defaultChoices.length - 1,
            type: "select",
        },
    ]);

    return project;
};

const initializeCustomProject = async () => {
    const { project } = await prompt<{ project: string }>([
        {
            ...defaultSettings,
            initial: "./tsconfig.json",
            type: "text",
        },
    ]);

    return project;
};
