import { TypeStatOptions } from "./types";

export const findComplaintForOptions = (options: TypeStatOptions): string | undefined => {
    if (noFixesSpecified(options)) {
        return "No fixes or custom mutators specified. Consider enabling --fixNoImplicitAny (see http://github.com/joshuakgoldberg/typestat#cli).";
    }

    if (strictNonNullAssertionsInNonStrictMode(options)) {
        return "--fixStrictNonNullAssertions specified but not strictNullChecks. Consider enabling --strictNullChecks (see http://github.com/joshuakgoldberg/typestat/blob/master/docs/Fixes.md).";
    }

    return undefined;
};

const noFixesSpecified = (options: TypeStatOptions): boolean =>
    options.mutators.length === 0 &&
    !options.fixes.incompleteTypes &&
    !options.fixes.missingProperties &&
    !options.fixes.noImplicitAny &&
    !options.fixes.noImplicitThis &&
    !options.fixes.strictNonNullAssertions;

const strictNonNullAssertionsInNonStrictMode = (options: TypeStatOptions): boolean =>
    options.fixes.strictNonNullAssertions && !options.types.strictNullChecks;
