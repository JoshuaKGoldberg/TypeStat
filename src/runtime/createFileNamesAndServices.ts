import { TypeStatOptions } from "../options/types";
import { createLanguageServices } from "../services/language";

export const createFileNamesAndServices = (options: TypeStatOptions) => {
    const services = createLanguageServices(options);
    const fileNames = options.fileNames;

    return { fileNames, services };
};
