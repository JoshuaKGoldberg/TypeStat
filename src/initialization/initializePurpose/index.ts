import { prompt } from "enquirer";
import * as fs from "fs";

export enum InitializationPurpose {
    ConvertJavaScript = "Convert my JavaScript files to TypeScript",
    Skipped = "Run TypeStat with the typestat.json file that already exists",
    ImproveTypeScript = "Improve typings in my TypeScript files",
}

export const initializePurpose = async () => {
    const choices = [InitializationPurpose.ConvertJavaScript, InitializationPurpose.ImproveTypeScript];

    if (fs.existsSync("typestat.json")) {
        choices.unshift(InitializationPurpose.Skipped);
    }

    const { purpose } = await prompt<{ purpose: InitializationPurpose }>([
        {
            choices,
            message: "What are you trying to accomplish?",
            name: "purpose",
            type: "select",
        },
    ]);

    return purpose;
};
