export const pluralize = (count: number, word: string, suffix = "s") => {
	return count === 1 ? word : `${word}${suffix}`;
};
