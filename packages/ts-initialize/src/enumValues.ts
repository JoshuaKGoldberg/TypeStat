// TODO: npm package?

export function enumValues<Enum extends Record<string, string>>(
	stringEnum: Enum,
) {
	return Object.values(
		stringEnum,
	) as unknown as (typeof stringEnum)[keyof typeof stringEnum];
}
