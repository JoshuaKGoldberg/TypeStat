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

    // If an undeclared property is referenced multiple times, TypeScript will suggest adding it in each time
    // We therefore only suggest each property name once per wave
    // In theory, we could also respect each node name per class, but that's hard, and it's rare to have many classes per file
    const suggestedMissingProperties = new Set<string>();

    const visitPropertyAccessExpression = (node: ts.PropertyAccessExpression, request: FileMutationsRequest): IMutation | undefined => {
        // If the access should create a missing property, go for that
        const missingPropertyFix = getMissingPropertyMutations(request, node);
        if (missingPropertyFix !== undefined) {
            // Don't suggest this missing property if a node of this name was already added
            if (suggestedMissingProperties.has(node.name.text)) {
                return undefined;
            }

            suggestedMissingProperties.add(node.name.text);
            return missingPropertyFix;
        }

        // If we can fix a strict null check fix here, try that
        const strictPropertyAccessFix = getStrictPropertyAccessFix(request, node);
        if (strictPropertyAccessFix !== undefined) {
            return strictPropertyAccessFix;
        }

        return undefined;
    };

    return collectMutationsFromNodes(request, ts.isPropertyAccessExpression, visitPropertyAccessExpression);
};
