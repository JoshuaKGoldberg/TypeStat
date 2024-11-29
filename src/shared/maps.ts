export type Dictionary<TValue> = Record<string, TValue>;

export const convertMapToObject = <TValue>(
	map: ReadonlyMap<string, TValue>,
): Dictionary<TValue> => {
	const output: Dictionary<TValue> = {};

	for (const [key, value] of map) {
		output[key] = value;
	}

	return output;
};
