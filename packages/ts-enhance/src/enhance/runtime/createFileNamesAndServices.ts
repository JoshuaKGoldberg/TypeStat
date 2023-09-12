import { TSEnhanceOptions } from "../../options/types.js";
import { createLanguageServices } from "../../services/language.js";

export const createFileNamesAndServices = (options: TSEnhanceOptions) => {
	const services = createLanguageServices(options);
	const fileNames = options.fileNames;

	return { fileNames, services };
};
