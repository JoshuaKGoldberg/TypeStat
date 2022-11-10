import { prompt } from "enquirer";
import * as fs from "fs";

import { uniquify } from "../../shared/arrays";
import { globAllAsync } from "../../shared/glob";
import { initializeNewProject } from "./initializeNewProject";
import { ProjectDescription, TSConfigLocationSuggestion, TSConfigLocation } from "./shared";

export const initializeProject = async (): Promise<ProjectDescription> => {
    const project = await initializeBuiltInProject();

    return project === TSConfigLocationSuggestion.Custom
        ? initializeCustomProject()
        : project === TSConfigLocationSuggestion.DoesNotExist
        ? initializeNewProject()
        : { filePath: project };
};

const defaultSettings = {
    message: "Where is your tsconfig.json?",
    name: "project",
};

const initializeBuiltInProject = async () => {
    const choices = [
        ...uniquify(TSConfigLocation.Root, TSConfigLocation.UnderSrc, ...(await globAllAsync(["./tsconfig*json", "./*/tsconfig*json"]))),
        TSConfigLocationSuggestion.Custom,
        TSConfigLocationSuggestion.DoesNotExist,
    ];

    const { project } = await prompt<{ project: TSConfigLocation | TSConfigLocationSuggestion }>([
        {
            ...defaultSettings,
            choices,
            initial: Math.max(
                0,
                [TSConfigLocation.Root, TSConfigLocation.UnderSrc].findIndex((choice) => fs.existsSync(choice)),
            ),
            type: "select",
        },
    ]);

    return project;
};

const initializeCustomProject = async (): Promise<ProjectDescription> => {
    const { project } = await prompt<{ project: string }>([
        {
            ...defaultSettings,
            initial: "./tsconfig.json",
            type: "text",
        },
    ]);

    return { filePath: project };
};
