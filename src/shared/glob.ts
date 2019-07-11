import glob from "glob";

export const globAsync = async (include: string, options: glob.IOptions = {}): Promise<ReadonlyArray<string>> =>
    new Promise<ReadonlyArray<string>>((resolve, reject) => {
        glob(include, options, (error: Error | null, matches: ReadonlyArray<string>) => {
            if (error !== null) {
                reject(error);
                return;
            }

            resolve(matches);
        });
    });

export const globAllAsync = async (includes: ReadonlyArray<string>, options: glob.IOptions = {}) =>
    (await Promise.all(includes.map(async (include: string) => globAsync(include, options)))).reduce(
        (allResults: ReadonlyArray<string>, nextResults: ReadonlyArray<string>) => allResults.concat(nextResults),
        [],
    );
