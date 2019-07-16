import chalk from "chalk";
import { prompt } from "enquirer";
import { EOL } from "os";

import { ResultStatus } from "..";
import { ProcessLogger } from "../logging/logger";
import { getQuickErrorSummary } from "../shared/errors";

import { initializeJavaScript } from "./initializeJavaScript";
import { initializeTypeScript } from "./initializeTypeScript";
import { InitializationPurpose } from "./purpose";

const fileName = "typestat.json";

export const initialization = async (logger: ProcessLogger): Promise<ResultStatus> => {
    logger.stdout.write(chalk.greenBright("👋"));
    logger.stdout.write(chalk.green(" Welcome to TypeStat! "));
    logger.stdout.write(chalk.greenBright("👋"));
    logger.stdout.write(chalk.reset(EOL));

    logger.stdout.write(chalk.reset(`This will create a new `));
    logger.stdout.write(chalk.yellowBright(fileName));
    logger.stdout.write(chalk.reset(` for you.${EOL}`));
    logger.stdout.write(`If you don't know how to answer, that's ok - just select the default answer.${EOL}`);
    logger.stdout.write(chalk.reset(EOL));

    try {
        await runPrompts();
    } catch (error) {
        logger.stderr.write(getQuickErrorSummary(error));
        return ResultStatus.ConfigurationError;
    }

    logger.stdout.write(chalk.reset(`${EOL}Awesome! You're now ready to:${EOL}${EOL}`));
    logger.stdout.write(chalk.greenBright(`typestat --config ${fileName}`));
    logger.stdout.write(chalk.reset(`${EOL}${EOL}Once you run that, TypeStat will start auto-fixing your typings.${EOL}`));
    logger.stdout.write(chalk.yellow(`Please report any bugs on https://github.com/JoshuaKGoldberg/TypeStat! `));
    logger.stdout.write(chalk.yellowBright("💖"));
    logger.stdout.write(chalk.reset(EOL));

    return ResultStatus.Succeeded;
};

const runPrompts = async () => {
    const { purpose } = await prompt([
        {
            choices: [InitializationPurpose.ConvertJavaScript, InitializationPurpose.ImproveTypeScript],
            message: "What are you trying to accomplish?",
            name: "purpose",
            type: "select",
        },
    ]);

    await (purpose === InitializationPurpose.ConvertJavaScript ? initializeJavaScript : initializeTypeScript)(fileName);
};
