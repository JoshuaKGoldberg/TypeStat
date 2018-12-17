export const arrayify = <T>(items: T | ReadonlyArray<T> | undefined): T[] => {
    if (items === undefined) {
        return [];
    }

    if (Array.isArray(items)) {
        return items;
    }

    return [items as T];
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
