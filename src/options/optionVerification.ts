import { TypeStatOptions } from "./types";

export const findComplaintForOptions = (options: TypeStatOptions | string): string | undefined => {
    if (typeof options === "string") {
        return options;
    }

    if (noFixesSpecified(options)) {
        return "No fixes or custom mutators specified. Consider enabling --fixNoImplicitAny (see http://github.com/joshuakgoldberg/typestat#cli).";
    }

    if (strictNonNullAssertionsInNonStrictMode(options)) {
        return "--fixStrictNonNullAssertions specified but not strictNullChecks. Consider enabling --typeStrictNullChecks (see http://github.com/joshuakgoldberg/typestat/blob/master/docs/Fixes.md).";
    }

    return undefined;
};

const noFixesSpecified = (options: TypeStatOptions): boolean =>
        options.mutators.length === 0 &&
        !options.fixes.incompleteTypes &&
        !options.fixes.missingProperties &&
        !options.fixes.noImplicitAny &&
        !options.fixes.strictNonNullAssertions,
    strictNonNullAssertionsInNonStrictMode = (options: TypeStatOptions): boolean =>
        options.fixes.strictNonNullAssertions && !options.types.strictNullChecks;
