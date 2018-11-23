import * as fs from "mz/fs";
import * as path from "path";

interface PackageInfo {
    readonly version: string;
}

export const getPackageVersion = async (): Promise<string> => {
    const packagePath = path.join(__dirname, "../../package.json");
    const rawText = (await fs.readFile(packagePath)).toString();

    return (JSON.parse(rawText) as PackageInfo).version;
};
