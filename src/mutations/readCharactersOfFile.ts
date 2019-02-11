import { fs } from "mz";

export const readCharactersOfFile = async (fileName: string, length: number) =>
    new Promise<string>((resolve, reject) => {
        fs.open(fileName, "r", (status, fd) => {
            if (status) {
                reject(new Error(`Could not read '${fileName}': ERROR ${status}.`));
                return;
            }

            const buffer = new Buffer(length);
            fs.read(fd, buffer, 0, length, 0, (error) => {
                if (error) {
                    reject(new Error(`Could not read '${fileName}': ${error}.`));
                }

                resolve(buffer.toString());
            });
        });
    });
