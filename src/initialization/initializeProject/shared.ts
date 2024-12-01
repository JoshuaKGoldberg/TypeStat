export enum TSConfigLocation {
	Root = "./tsconfig.json",
	UnderSrc = "./src/tsconfig.json",
}

export enum TSConfigLocationSuggestion {
	Custom = "custom",
	DoesNotExist = "I don't have one yet",
}

export interface ProjectDescription {
	created?: boolean;
	filePath: string;
}
