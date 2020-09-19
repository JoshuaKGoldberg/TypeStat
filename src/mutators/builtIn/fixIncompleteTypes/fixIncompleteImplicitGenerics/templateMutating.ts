import * as ts from "typescript";

import { createTypeName } from "../../../../mutations/aliasing/createTypeName";
import { AssignedTypesByName, joinAssignedTypesByName } from "../../../../mutations/assignments";
import { createDeclarationForTypeSummaries } from "../../../../mutations/creations/creationMutations";
import { summarizeAllAssignedTypes } from "../../../../mutations/expansions/summarization";
import { getFriendlyTypeParameterDeclarationName, getPerceivedNameOfClass } from "../../../../mutations/naming";
import { FileMutationsRequest } from "../../../fileMutator";

export const fillInMissingTemplateTypes = (
    request: FileMutationsRequest,
    childClass: ts.ClassLikeDeclaration,
    baseTypeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
    templateTypeLists: (AssignedTypesByName | undefined)[],
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
            templateTypeNames.push(findDefaultTemplateValue(request, baseTypeParameters[i]));
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

    const baseTypeDefault = request.services.program.getTypeChecker().getTypeAtLocation(baseTypeParameter.default);
    const typeName = createTypeName(request, baseTypeDefault);

    return typeName === undefined ? "{}" : typeName;
};

const createTemplateTypeName = (
    childClassName: string,
    baseTypeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
    baseTypeParameter: ts.TypeParameterDeclaration,
) => {
    const friendlyName = getFriendlyTypeParameterDeclarationName(baseTypeParameters, baseTypeParameter);

    return childClassName + friendlyName[0].toUpperCase() + friendlyName.slice(1);
};
