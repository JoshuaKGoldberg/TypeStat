export const arrayify = <T>(items: T | ReadonlyArray<T> | undefined): ReadonlyArray<T> => {
    if (items === undefined) {
        return [];
    }

    if (items instanceof Array) {
        return items;
    }

    return [items];
};

export const collectOptionals = <T>(...arrays: (ReadonlyArray<T> | undefined)[]): T[] => {
    const results: T[] = [];

    for (const array of arrays) {
        if (array !== undefined) {
            results.push(...array);
        }
    }

    return results;
};

export const isNotUndefined = <T>(item: T | undefined): item is T => item !== undefined;
