export const constructArrayShorthand = (genericTypeNames: string[]) => {
	const body = genericTypeNames.join(" | ");

	return body.includes(" ") ? `(${body})[]` : `${body}[]`;
};
