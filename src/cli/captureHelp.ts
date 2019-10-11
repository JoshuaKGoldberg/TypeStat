import { Command } from "commander";

export const captureHelp = async (command: Command): Promise<string> =>
    new Promise((resolve) => {
        command.outputHelp((helpText: string): string => {
            resolve(helpText);
            return "";
        });
    });
