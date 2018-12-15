export const arrayify = <T>(items: T | ReadonlyArray<T> | undefined): T[] => {
    if (items === undefined) {
        return [];
    }

    if (Array.isArray(items)) {
        return items;
    }

    return [items as T];
};
