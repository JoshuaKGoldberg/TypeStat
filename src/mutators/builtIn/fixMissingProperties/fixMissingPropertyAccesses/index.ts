import { IMutation } from "automutate";
import * as ts from "typescript";

import { getMissingPropertyMutations } from "../../../../mutations/codeFixes/addMissingProperty";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixMissingPropertyAccesses: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    // If an undeclared property is referenced multiple times, TypeScript will suggest adding it in each time
    // We therefore only suggest each property name once per wave
    // In theory, we could also respect each node name per class, but that's hard, and it's rare to have many classes per file
    const suggestedMissingProperties = new Set<string>();

    const typeChecker = request.services.program.getTypeChecker();

    const visitPropertyAccessExpression = (node: ts.PropertyAccessExpression): IMutation | undefined => {
        // If the access should create a missing property, go for that
        const missingPropertyFix = getMissingPropertyMutations(request, node);
        if (missingPropertyFix === undefined) {
            return undefined;
        }

        // Don't suggest this missing property if a node of this name was already added
        if (suggestedMissingProperties.has(node.name.text)) {
            return undefined;
        }

        // Additionally, for some reason, the language service seems suggest the same fixes repeatedly sometimes...
        // To get around this, we ignore any fixes for nodes that already exist on the parent class
        // https://github.com/JoshuaKGoldberg/TypeStat/issues/756
        const assigneeClassType = typeChecker.getTypeAtLocation(node.expression);
        if (assigneeClassType.getProperty(node.name.text) !== undefined) {
            return undefined;
        }

        suggestedMissingProperties.add(node.name.text);
        return missingPropertyFix;
    };

    return collectMutationsFromNodes(request, ts.isPropertyAccessExpression, visitPropertyAccessExpression);
};
