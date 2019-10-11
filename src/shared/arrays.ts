export const arrayify = <T>(items: T | readonly T[] | undefined): T[] => {
    if (items === undefined) {
        return [];
    }

    if (Array.isArray(items)) {
        return items;
    }

    return [items as T];
};

export const collectOptionals = <T>(...arrays: (readonly T[] | undefined)[]): T[] => {
    const results: T[] = [];

    for (const array of arrays) {
        if (array !== undefined) {
            results.push(...array);
        }
    }

    return results;
};

export const isNotUndefined = <T>(item: T | undefined): item is T => item !== undefined;
