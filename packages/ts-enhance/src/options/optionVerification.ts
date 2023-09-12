import { PendingTSEnhanceOptions } from "./types.js";

export const findComplaintForOptions = (
	options: PendingTSEnhanceOptions | string,
): string | undefined => {
	if (typeof options === "string") {
		return options;
	}

	if (noFixesSpecified(options)) {
		return "No fixes or custom mutators specified. Consider enabling fixes.noImplicitAny.";
	}

	if (strictNonNullAssertionsInNonStrictMode(options)) {
		return "fixes.strictNonNullAssertions specified but not strictNullChecks. Consider enabling types.strictNullChecks.";
	}

	return undefined;
};

const noFixesSpecified = (options: PendingTSEnhanceOptions): boolean =>
	options.mutators.length === 0 &&
	!options.fixes.incompleteTypes &&
	!options.fixes.missingProperties &&
	!options.fixes.noImplicitAny &&
	!options.fixes.strictNonNullAssertions;

const strictNonNullAssertionsInNonStrictMode = (
	options: PendingTSEnhanceOptions,
): boolean =>
	options.fixes.strictNonNullAssertions && !options.types.strictNullChecks;
