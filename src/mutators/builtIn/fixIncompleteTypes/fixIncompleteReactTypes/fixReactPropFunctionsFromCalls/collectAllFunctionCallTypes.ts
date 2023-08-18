import * as ts from "typescript";
import { getDeclaredTypesOfArgument } from "../../../../../shared/calls";
import { isPropertySignatureWithStaticName, PropertySignatureWithStaticName } from "../../../../../shared/nodeTypes";
import { getTypeAtLocationIfNotError } from "../../../../../shared/types";

import { FileMutationsRequest } from "../../../../../shared/fileMutator";
import { ReactComponentPropsNode } from "../getComponentPropsNode";
import { getPropNodeFromReference } from "../getPropNodeFromReference";

export type FunctionCallType = {
    parameters?: (ts.Type | undefined)[];
    returnValue?: ts.Type;
};

export const collectAllFunctionCallTypes = (request: FileMutationsRequest, propsNode: ReactComponentPropsNode) => {
    const allFunctionCallTypes = new Map<PropertySignatureWithStaticName, FunctionCallType[]>();

    for (const member of propsNode.members) {
        // Don't look at properties without obvious names and types explicitly set to Function
        if (
            !isPropertySignatureWithStaticName(member) ||
            member.type === undefined ||
            !ts.isTypeReferenceNode(member.type) ||
            !ts.isIdentifier(member.type.typeName) ||
            member.type.typeName.text !== "Function"
        ) {
            continue;
        }

        collectFunctionCallsTypes(request, member, allFunctionCallTypes);
    }

    return allFunctionCallTypes;
};

const collectFunctionCallsTypes = (
    request: FileMutationsRequest,
    member: PropertySignatureWithStaticName,
    allFunctionCallTypes: Map<PropertySignatureWithStaticName, FunctionCallType[]>,
) => {
    // Find all references to the name of the type
    const references = request.fileInfoCache.getNodeReferencesAsNodes(member.name);
    if (references === undefined) {
        return;
    }

    const functionCallTypes: FunctionCallType[] = [];

    // For each reference, try to infer the type from its usage...
    for (const reference of references) {
        // (except for the original member we're looking around)
        if (reference === member || !tsutils.isExpression(reference)) {
            continue;
        }

        const call = getCallForReference(reference);
        if (call !== undefined) {
            collectFunctionCallTypes(request, functionCallTypes, call);
        }
    }

    allFunctionCallTypes.set(member, functionCallTypes);
};

const getCallForReference = (reference: ts.Expression) => {
    reference = getPropNodeFromReference(reference);

    return ts.isCallExpression(reference.parent) ? reference.parent : undefined;
};

const collectFunctionCallTypes = (request: FileMutationsRequest, functionCallTypes: FunctionCallType[], call: ts.CallExpression) => {
    // Case: the return value is directly passed to a function
    if (ts.isCallExpression(call.parent) || ts.isNewExpression(call.parent)) {
        const declaredTypes = getDeclaredTypesOfArgument(request, call.parent, call);

        for (const declaredType of declaredTypes) {
            functionCallTypes.push({
                returnValue: declaredType,
            });
        }
    }

    // If the prop function is passed arguments, infer types from them
    if (call.arguments.length !== 0) {
        functionCallTypes.push({
            parameters: call.arguments.map((callArgument) => getTypeAtLocationIfNotError(request, callArgument)),
        });
    }
};
