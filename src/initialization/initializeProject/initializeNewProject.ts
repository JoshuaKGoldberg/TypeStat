import { fs } from "mz";
import { prompt } from "enquirer";
import { ProjectDescription } from "./shared";

const filePath = "./tsconfig.json";

export const initializeNewProject = async (): Promise<ProjectDescription> => {
    const { emit } = await prompt<{ emit: string }>([
        {
            choices: ["yes", "no"],
            message: "Should TypeScript output .js files from .ts sources?",
            name: "emit",
            type: "select",
        },
    ]);
    const { inBrowser } = await prompt<{ inBrowser: string }>([
        {
            choices: ["yes", "no"],
            message: "Does your code run in browser?",
            name: "inBrowser",
            type: "select",
        },
    ]);
    const jsx =
        inBrowser &&
        (
            await prompt<{ jsx: string }>([
                {
                    choices: ["yes", "no"],
                    message: "Does your project use JSX?",
                    name: "jsx",
                    type: "select",
                },
            ])
        ).jsx;
    const { target } = await prompt<{ target: string }>([
        {
            choices: ["es2020", "es2021", "es2022", "esnext"],
            message: "What minimum runtime does your code run on?",
            name: "target",
            type: "select",
        },
    ]);
    const { strict } = await prompt<{ strict: string }>([
        {
            choices: ["yes", "no"],
            message: "Would you like to enable TypeScript's strict compiler options? (recommended)",
            name: "strict",
            type: "select",
        },
    ]);

    await fs.writeFile(
        filePath,
        JSON.stringify(
            {
                compilerOptions: {
                    declaration: true,
                    declarationMap: true,
                    ...(emit === "no" && { noEmit: true }),
                    esModuleInterop: true,
                    ...(inBrowser === "no" && { lib: [target] }),
                    ...(jsx === "yes" && { jsx: "react" }),
                    sourceMap: true,
                    moduleResolution: "node",
                    module: "nodenext",
                    skipLibCheck: true,
                    ...(strict === "yes" ? { strict: true } : {}),
                    target,
                },
            },
            null,
            4,
        ),
    );

    return { created: true, filePath };
};
