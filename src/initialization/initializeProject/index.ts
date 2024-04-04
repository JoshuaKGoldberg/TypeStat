import enruirer from "enquirer";
import * as fs from "fs";
import { glob } from "glob";

import { uniquify } from "../../shared/arrays.js";
import { initializeNewProject } from "./initializeNewProject.js";
import {
	ProjectDescription,
	TSConfigLocation,
	TSConfigLocationSuggestion,
} from "./shared.js";

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
		...uniquify(
			TSConfigLocation.Root,
			TSConfigLocation.UnderSrc,
			...(await glob(["./tsconfig*json", "./*/tsconfig*json"])),
		),
		TSConfigLocationSuggestion.Custom,
		TSConfigLocationSuggestion.DoesNotExist,
	];

	const { project } = await enruirer.prompt<{
		project: TSConfigLocation | TSConfigLocationSuggestion;
	}>([
		{
			...defaultSettings,
			choices,
			initial: Math.max(
				0,
				[TSConfigLocation.Root, TSConfigLocation.UnderSrc].findIndex((choice) =>
					fs.existsSync(choice),
				),
			),
			type: "select",
		},
	]);

	return project;
};

const initializeCustomProject = async (): Promise<ProjectDescription> => {
	const { project } = await enruirer.prompt<{ project: string }>([
		{
			...defaultSettings,
			initial: "./tsconfig.json",
			type: "text",
		},
	]);

	return { filePath: project };
};
