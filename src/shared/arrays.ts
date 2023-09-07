export const arrayify = <T>(items: T | readonly T[] | undefined): readonly T[] => {
    if (items === undefined) {
        return [];
    }

    if (items instanceof Array) {
        return items;
    }

    return [items];
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

export const uniquify = <T>(...items: T[]): T[] => {
    return Array.from(new Set(items));
};
