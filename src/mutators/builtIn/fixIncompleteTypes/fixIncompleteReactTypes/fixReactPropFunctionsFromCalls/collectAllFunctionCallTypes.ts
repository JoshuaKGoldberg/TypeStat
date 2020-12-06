import * as ts from "typescript";
import { isTypeElementWithStaticName, TypeElementWithStaticName } from "../../../../../shared/nodeTypes";
import { getTypeAtLocationIfNotError } from "../../../../../shared/types";

import { FileMutationsRequest } from "../../../../fileMutator";
import { ReactComponentPropsNode } from "../getComponentPropsNode";

export type FunctionCallType = {
    parameters?: (ts.Type | undefined)[];
    returnValue?: ts.Type;
};

export const collectAllFunctionCallTypes = (request: FileMutationsRequest, propsNode: ReactComponentPropsNode) => {
    const allFunctionCallTypes = new Map<TypeElementWithStaticName, FunctionCallType[]>();

    for (const member of propsNode.members) {
        collectFunctionCallsTypes(request, member, allFunctionCallTypes);
    }

    return allFunctionCallTypes;
};

const collectFunctionCallsTypes = (
    request: FileMutationsRequest,
    member: ts.TypeElement,
    allFunctionCallTypes: Map<TypeElementWithStaticName, FunctionCallType[]>,
) => {
    if (!isTypeElementWithStaticName(member)) {
        return;
    }

    // Find all references to the name of the type
    const references = request.fileInfoCache.getNodeReferencesAsNodes(member.name);
    if (references === undefined) {
        return;
    }

    const functionCallTypes: FunctionCallType[] = [];

    // For each reference, try to infer the type from its usage...
    for (const reference of references) {
        // (except for the original member we're looking around)
        if (reference === member) {
            continue;
        }

        const call = getCallForReference(reference);
        if (call !== undefined) {
            collectFunctionCallTypes(request, functionCallTypes, call);
        }
    }

    allFunctionCallTypes.set(member, functionCallTypes);
};

const getCallForReference = (reference: ts.Node) => {
    // Case: class-style (e.g. 'this.props.key') or object style 'props.key'
    if (ts.isPropertyAccessExpression(reference.parent)) {
        reference = reference.parent;
    }

    return ts.isCallExpression(reference.parent) ? reference.parent : undefined;
};

const collectFunctionCallTypes = (request: FileMutationsRequest, functionCallTypes: FunctionCallType[], call: ts.CallExpression) => {
    // Case: the return value is directly passed to a function
    if ((ts.isCallExpression(call.parent) || ts.isNewExpression(call.parent)) && call.parent.arguments !== undefined) {
        // Find the corresponding type for the function that's taking in the prop function call
        const parentCallType = getTypeAtLocationIfNotError(request, call.parent.expression);
        if (parentCallType !== undefined) {
            // Get the signatures for that parent call
            const parentSignatures = ts.isCallExpression(call.parent)
                ? parentCallType.getCallSignatures()
                : parentCallType.getConstructSignatures();
            const parameterIndex = call.parent.arguments.indexOf(call);

            // For each signature, infer the paramter type that the prop function's return is being passed to
            for (const parentSignature of parentSignatures) {
                functionCallTypes.push({
                    returnValue: request.services.program
                        .getTypeChecker()
                        .getTypeOfSymbolAtLocation(parentSignature.parameters[parameterIndex], call.parent.arguments[parameterIndex]),
                });
            }
        }
    }

    // If the prop function is passed arguments, infer types from them
    if (call.arguments.length !== 0) {
        functionCallTypes.push({
            parameters: call.arguments.map((callArgument) => getTypeAtLocationIfNotError(request, callArgument)),
        });
    }
};
