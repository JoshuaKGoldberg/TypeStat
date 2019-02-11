import chalk from "chalk";
import { readline } from "mz";

import { TypeStatOptions } from "../options/types";
import { createLanguageServices } from "../services/language";

export const createFileNamesAndServices = (options: TypeStatOptions) => {
    options.logger.stdout.write(chalk.grey("Preparing language services to visit files...\n"));
    const services = createLanguageServices(options);
    const fileNames =
        options.fileNames === undefined
            ? services.parsedConfiguration.fileNames.filter((fileName) => !fileName.endsWith(".d.ts"))
            : options.fileNames;

    readline.moveCursor(options.logger.stdout, 0, -1);
    readline.clearLine(options.logger.stdout, 0);
    return { fileNames, services };
};
