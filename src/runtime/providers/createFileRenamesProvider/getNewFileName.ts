import { RenameExtensions } from "../../../options/types";

export const getNewFileName = async (
    renameExtensions: RenameExtensions,
    oldFileName: string,
    readFile: (filePath: string) => Promise<string>,
): Promise<string> => {
    const oldExtension = oldFileName.substring(oldFileName.lastIndexOf("."));
    const beforeExtension = oldFileName.substring(0, oldFileName.length - oldExtension.length);

    if (typeof renameExtensions === "string") {
        return `${beforeExtension}.${renameExtensions}`;
    }

    const fileContents = (await readFile(oldFileName)).toString();
    const fileContentsJoined = fileContents.replace(/ /g, "").replace(/"/g, "'");

    if (/(<\s*\/\s*[A-z\.]*\s*>)|(\/\s*>)/.test(fileContentsJoined)) {
        return `${beforeExtension}.tsx`;
    }

    return `${beforeExtension}.ts`;
};
