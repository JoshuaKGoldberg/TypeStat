export const setSubtract = <T>(whole: ReadonlySet<T>, removals: ReadonlySet<T>): Set<T> => {
    const result = new Set<T>();

    for (const item of whole) {
        if (!removals.has(item)) {
            result.add(item);
        }
    }

    return result;
};
