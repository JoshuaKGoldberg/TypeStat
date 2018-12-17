export const collectAsConfiguration = (...values: (boolean | undefined)[]): boolean => {
    for (const value of values) {
        if (value !== undefined) {
            return value;
        }
    }

    return false;
};
