import { TypeStatOptions } from "../options/types";
import { createLanguageServices } from "../services/language";

export const createFileNamesAndServices = (options: TypeStatOptions) => {
    const services = createLanguageServices(options),
        fileNames =
            options.fileNames === undefined
                ? services.parsedConfiguration.fileNames.filter((fileName) => !fileName.endsWith(".d.ts"))
                : options.fileNames;

    return { fileNames, services };
};
