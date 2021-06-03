import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { getTypeAtLocationIfNotError } from "./types";

export const getDeclaredTypesOfArgument = (
    request: FileMutationsRequest,
    parentCall: ts.CallExpression | ts.NewExpression,
    argument: ts.Expression,
) => {
    const declaredTypes: ts.Type[] = [];

    if (parentCall.arguments === undefined) {
        return declaredTypes;
    }

    const parentCallType = getTypeAtLocationIfNotError(request, parentCall.expression);
    if (parentCallType === undefined) {
        return declaredTypes;
    }

    // Get the signatures for that parent call
    const argumentIndex = parentCall.arguments.indexOf(argument);
    const typeChecker = request.services.program.getTypeChecker();
    const parentSignatures = ts.isCallExpression(parentCall) ? parentCallType.getCallSignatures() : parentCallType.getConstructSignatures();

    for (const parentSignature of parentSignatures) {
        if (argumentIndex >= parentSignature.parameters.length || parentSignature.declaration === undefined) {
            continue;
        }

        const parameterSymbol = parentSignature.parameters[argumentIndex];
        const parameterType = typeChecker.getTypeOfSymbolAtLocation(parameterSymbol, parentSignature.declaration.parameters[argumentIndex]);
        declaredTypes.push(parameterType);
    }

    return declaredTypes;
};

export const getCallExpressionType = (request: FileMutationsRequest, parentCall: ts.CallExpression) => {
    const typeChecker = request.services.program.getTypeChecker();
    const argumentTypes = parentCall.arguments.map((argument) => typeChecker.getTypeAtLocation(argument));

    return [
        "((",
        argumentTypes.map((parameter, index) => `arg${index}: ${request.services.printers.type(parameter)}`).join(", "),
        ") => unknown)",
    ].join("");
};
