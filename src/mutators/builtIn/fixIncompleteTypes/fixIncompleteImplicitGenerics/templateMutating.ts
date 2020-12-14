import * as ts from "typescript";

import { AssignedTypesByName, joinAssignedTypesByName } from "../../../../mutations/assignments";
import { createDeclarationForTypeSummaries } from "../../../../mutations/creations/creationMutations";
import { summarizeAllAssignedTypes } from "../../../../mutations/expansions/summarization";
import { getFriendlyTypeParameterDeclarationName, getPerceivedNameOfClass } from "../../../../mutations/naming";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { FileMutationsRequest } from "../../../fileMutator";

export const fillInMissingTemplateTypes = (
    request: FileMutationsRequest,
    childClass: ts.ClassLikeDeclaration,
    baseTypeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
    templateTypeLists: (string | AssignedTypesByName | undefined)[],
) => {
    const createdTypes: string[] = [];
    const templateTypeNames: string[] = [];
    const childClassName = getPerceivedNameOfClass(request, childClass);

    // Template types will be marked on the node up through the last missing type
    for (let i = 0; i < templateTypeLists.length; i += 1) {
        const templateTypes = templateTypeLists[i];

        // If the template type is fine on the node but missing, use the default from the generic
        // Example: a React component's props are {} but its state needs a new type
        if (templateTypes === undefined) {
            const defaultTemplateValue = findDefaultTemplateValue(request, baseTypeParameters[i]);
            if (defaultTemplateValue !== undefined) {
                templateTypeNames.push(defaultTemplateValue);
            }
            continue;
        }

        // If the template type is already a known name, directly use it
        if (typeof templateTypes === "string") {
            templateTypeNames.push(templateTypes);
            continue;
        }

        // In this case, the template type is missing: create a new type to fill the missing template type
        // That new type will need a name, which we'll generate from the class and relevant type parameter
        const newTemplateTypeName = createTemplateTypeName(childClassName, baseTypeParameters, baseTypeParameters[i]);

        // Properties on that template type are collected from uses of the type in the node
        const assignedTypeValues = Array.from(templateTypes).map(([name, type]) => ({ name, type }));
        const allAssignedTypes = joinAssignedTypesByName(request, assignedTypeValues);
        const newType = createDeclarationForTypeSummaries(
            request,
            undefined /* enclosingDeclaration */,
            newTemplateTypeName,
            summarizeAllAssignedTypes(request, [allAssignedTypes]),
        );

        createdTypes.push(newType);
        templateTypeNames.push(newTemplateTypeName);
    }

    return { createdTypes, templateTypeNames };
};

const findDefaultTemplateValue = (request: FileMutationsRequest, baseTypeParameter: ts.TypeParameterDeclaration) => {
    if (baseTypeParameter.default === undefined) {
        return "{}";
    }

    const baseTypeDefault = getTypeAtLocationIfNotError(request, baseTypeParameter.default);
    if (baseTypeDefault === undefined) {
        return undefined;
    }

    return request.services.printers.type(baseTypeDefault);
};

const createTemplateTypeName = (
    childClassName: string,
    baseTypeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
    baseTypeParameter: ts.TypeParameterDeclaration,
) => {
    const friendlyName = getFriendlyTypeParameterDeclarationName(baseTypeParameters, baseTypeParameter);

    return childClassName + friendlyName[0].toUpperCase() + friendlyName.slice(1);
};
