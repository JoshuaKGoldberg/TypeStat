/**
 * Whether to use components' propTypes for inferences.
 */
export enum ReactPropTypesHint {
	/**
	 * Always factor in all propTypes.
	 */
	Always = "always",

	/**
	 * Don't factor in propTypes at all.
	 */
	Ignore = "ignore",

	/**
	 * Only factor in nodes that are make as .required.
	 */
	WhenRequired = "whenRequired",
}

/**
 * Whether to make propType inferences optional and/or required.
 */
export enum ReactPropTypesOptionality {
	/**
	 * Always make the added props optional.
	 */
	AlwaysOptional = "alwaysOptional",

	/**
	 * Always make the added props required.
	 */
	AlwaysRequired = "alwaysRequired",

	/**
	 * Respect whether the original code has .isRequired.
	 */
	AsWritten = "asWritten",
}
