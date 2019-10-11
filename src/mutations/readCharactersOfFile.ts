import * as fs from "fs";

// tslint:disable:strict-boolean-expressions

export const readCharactersOfFile = (fileName: string, length: number): string => {
    const fd = fs.openSync(fileName, "r"),
        buffer = Buffer.alloc(length);

    fs.readSync(fd, buffer, 0, length, 0);

    return buffer.toString();
};
