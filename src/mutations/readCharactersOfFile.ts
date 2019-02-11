import { fs } from "mz";

// tslint:disable:strict-boolean-expressions

export const readCharactersOfFile = async (fileName: string, length: number) =>
    new Promise<string>((resolve, reject) => {
        fs.open(fileName, "r", (status, fd) => {
            if (status) {
                reject(new Error(`Could not read '${fileName}': ERROR ${status}.`));
                return;
            }

            const buffer = Buffer.alloc(length);
            fs.read(fd, buffer, 0, length, 0, (error) => {
                if (error) {
                    reject(new Error(`Could not read '${fileName}': ${error}.`));
                }

                resolve(buffer.toString());
            });
        });
    });
