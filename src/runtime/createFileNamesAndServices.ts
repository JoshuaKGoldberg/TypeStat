import { TypeStatOptions } from "../options/types.js";
import { createLanguageServices } from "../services/language.js";

export const createFileNamesAndServices = (options: TypeStatOptions) => {
	const services = createLanguageServices(options);
	const fileNames = options.fileNames;

	return { fileNames, services };
};
