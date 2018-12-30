import { TypeStatOptions } from "./types";

export const findComplaintForOptions = (options: TypeStatOptions): string | undefined => {
    if (noFixesSpecified(options)) {
        return "No fixes or custom mutators specified. Consider enabling --fixNoImplicitAny (see http://github.com/joshuakgoldberg/typestat#cli).";
    }

    return undefined;
};

const noFixesSpecified = (options: TypeStatOptions): boolean =>
    options.mutators.length === 0 &&
    !options.fixes.incompleteTypes &&
    !options.fixes.missingProperties &&
    !options.fixes.noImplicitAny &&
    !options.fixes.noImplicitThis;
