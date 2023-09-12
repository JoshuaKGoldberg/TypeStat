export const setSubtract = <T>(
	whole: ReadonlySet<T>,
	...removals: ReadonlySet<T>[]
): Set<T> => {
	const result = new Set<T>(whole);

	for (const removal of removals) {
		for (const item of result) {
			if (removal.has(item)) {
				result.delete(item);
			}
		}
	}

	return result;
};
