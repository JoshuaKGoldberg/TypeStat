import enquirer from "enquirer";
import { existsSync } from "node:fs";
import { glob } from "node:fs/promises";
import path from "node:path";

import { uniquify } from "../../shared/arrays.js";
import { initializeNewProject } from "./initializeNewProject.js";
import {
	ProjectDescription,
	TSConfigLocation,
	TSConfigLocationSuggestion,
} from "./shared.js";

const prompt = enquirer.prompt;

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
			...(await getTsConfigPaths()),
		),
		TSConfigLocationSuggestion.Custom,
		TSConfigLocationSuggestion.DoesNotExist,
	];

	const { project } = await prompt<{
		project: TSConfigLocation | TSConfigLocationSuggestion;
	}>([
		{
			...defaultSettings,
			choices,
			initial: Math.max(
				0,
				[TSConfigLocation.Root, TSConfigLocation.UnderSrc].findIndex((choice) =>
					existsSync(choice),
				),
			),
			type: "select",
		},
	]);

	return project;
};

export const getTsConfigPaths = async (): Promise<string[]> => {
	const cwd = process.cwd();
	const fileNames: string[] = [];
	for await (const entry of glob(["./tsconfig*json", "./*/tsconfig*json"])) {
		fileNames.push(path.join(cwd, entry));
	}
	return fileNames;
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
