import { IMutation } from "automutate";
import * as ts from "typescript";

import { getMissingPropertyMutations } from "../../mutations/codeFixes/addMissingProperty";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";
import { getStrictPropertyAccessFix } from "./propertyAccesses/fixStrictPropertyAccess";

export const propertyAccessExpressionMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    // This fixer is only relevant if fixing missing properties or fixing strict property accesses are enabled
    if (!request.options.fixes.missingProperties && !request.options.fixes.strictNonNullAssertions) {
        return [];
    }

    return collectMutationsFromNodes(request, ts.isPropertyAccessExpression, visitPropertyAccessExpression);
};

const visitPropertyAccessExpression = (node: ts.PropertyAccessExpression, request: FileMutationsRequest): IMutation | undefined => {
    // If the access should create a missing property, go for that
    const missingPropertyFix = getMissingPropertyMutations(request, node);
    if (missingPropertyFix !== undefined) {
        return missingPropertyFix;
    }

    // If we can fix a strict null check fix here, try that
    const strictPropertyAccessFix = getStrictPropertyAccessFix(request, node);
    if (strictPropertyAccessFix !== undefined) {
        return strictPropertyAccessFix;
    }

    return undefined;
};
