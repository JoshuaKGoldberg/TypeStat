import glob from "glob";

export const globAsync = async (include: string, options: glob.IOptions = {}): Promise<readonly string[]> =>
    new Promise<readonly string[]>((resolve, reject) => {
        glob(include, options, (error: Error | null, matches: readonly string[]) => {
            if (error !== null) {
                reject(error);
                return;
            }

            resolve(matches);
        });
    });

export const globAllAsync = async (includes: readonly string[], options: glob.IOptions = {}) =>
    (await Promise.all(includes.map(async (include: string) => globAsync(include, options)))).reduce(
        (allResults: readonly string[], nextResults: readonly string[]) => allResults.concat(nextResults),
        [],
    );
