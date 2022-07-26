import { PendingTypeStatOptions } from "./types";

export const findComplaintForOptions = (options: PendingTypeStatOptions | string): string | undefined => {
    if (typeof options === "string") {
        return options;
    }

    if (noFixesSpecified(options)) {
        return "No fixes or custom mutators specified. Consider enabling fixes.noImplicitAny (see http://github.com/joshuakgoldberg/typestat#cli).";
    }

    if (strictNonNullAssertionsInNonStrictMode(options)) {
        return "fixes.strictNonNullAssertions specified but not strictNullChecks. Consider enabling types.strictNullChecks (see http://github.com/joshuakgoldberg/typestat/blob/main/docs/Fixes.md).";
    }

    return undefined;
};

const noFixesSpecified = (options: PendingTypeStatOptions): boolean =>
    options.mutators.length === 0 &&
    !options.fixes.incompleteTypes &&
    !options.fixes.missingProperties &&
    !options.fixes.noImplicitAny &&
    !options.fixes.strictNonNullAssertions;

const strictNonNullAssertionsInNonStrictMode = (options: PendingTypeStatOptions): boolean =>
    options.fixes.strictNonNullAssertions && !options.types.strictNullChecks;
