export const createLazyValue = <T>(getter: () => Promise<T>) => {
    let value: Promise<T> | undefined;

    return {
        get() {
            if (value === undefined) {
                value = getter();
            }

            return value;
        },
        reset() {
            value = undefined;
        }
    };
};