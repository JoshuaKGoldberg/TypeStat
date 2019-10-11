/**
 * Converts a full file path to just the non-extension portion of the file name.
 *
 * @param fullFilePath   Full file path, such as `"C:/Code/Project/src/MyFile.ts"`.
 * @returns Non-extension part of the path, such as `"MyFile"`.
 */
export const getFriendlyFileName = (fullFilePath: string): string => {
    const lastSlashOrStart = fullFilePath.lastIndexOf("/") + 1,
        firstDotAfterLastSlash = fullFilePath.indexOf(".", lastSlashOrStart);

    return fullFilePath[lastSlashOrStart].toUpperCase() + fullFilePath.substring(lastSlashOrStart + 1, firstDotAfterLastSlash);
};
