export interface Dictionary<TValue> {
    // tslint:disable-next-line:readonly-keyword
    [i: string]: TValue;
}

export const convertMapToObject = <TValue>(map: ReadonlyMap<string, TValue>): Dictionary<TValue> => {
    const output: Dictionary<TValue> = {};

    for (const [key, value] of map) {
        output[key] = value;
    }

    return output;
};

export const convertObjectToMap = <TValue>(object: Readonly<Dictionary<TValue>>): Map<string, TValue> => {
    const map = new Map<string, TValue>();

    for (const key of Object.keys(object)) {
        map.set(key, object[key]);
    }

    return map;
};
