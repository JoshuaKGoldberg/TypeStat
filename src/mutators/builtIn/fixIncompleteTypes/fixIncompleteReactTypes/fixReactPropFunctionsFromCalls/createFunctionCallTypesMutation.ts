import { combineMutations, ITextSwapMutation } from "automutate";
import * as ts from "typescript";
import { findAliasOfTypes } from "../../../../../mutations/aliasing/findAliasOfTypes";
import { joinIntoType } from "../../../../../mutations/aliasing/joinIntoType";

import { collectOptionals, isNotUndefined } from "../../../../../shared/arrays";
import { PropertySignatureWithStaticName } from "../../../../../shared/nodeTypes";
import { FileMutationsRequest } from "../../../../fileMutator";
import { FunctionCallType } from "./collectAllFunctionCallTypes";

type CombinedFunctionType = {
    parameters: ts.Type[][];
    returnValue?: ts.Type[];
};

export const createFunctionCallTypesMutation = (
    request: FileMutationsRequest,
    allFunctionCallTypes: Map<PropertySignatureWithStaticName, FunctionCallType[]>,
) => {
    const mutations = Array.from(allFunctionCallTypes).map(([member, functionCallTypes]) => {
        return createFunctionCallTypeMutation(request, member, functionCallTypes);
    });

    return mutations === undefined || mutations.length === 0 ? undefined : combineMutations(...mutations);
};

const createFunctionCallTypeMutation = (
    request: FileMutationsRequest,
    member: PropertySignatureWithStaticName,
    functionCallTypes: FunctionCallType[],
): ITextSwapMutation => {
    const combinedType = functionCallTypes.reduce<CombinedFunctionType>(
        (accum, functionCallType) => {
            return {
                parameters: combineParameters(request, accum.parameters, functionCallType.parameters),
                returnValue: collectOptionals(accum.returnValue, [functionCallType.returnValue]).filter(isNotUndefined),
            };
        },
        {
            parameters: [],
            returnValue: [],
        },
    );

    return {
        insertion: `${member.name.text}: ${printFunctionType(request, combinedType)}`,
        range: {
            begin: member.getStart(request.sourceFile),
            end: member.end,
        },
        type: "text-swap",
    };
};

const combineParameters = (request: FileMutationsRequest, previous: ts.Type[][], next: (ts.Type | undefined)[] | undefined) => {
    if (next === undefined) {
        return previous;
    }

    const combined: ts.Type[][] = [];
    let i: number;

    for (i = 0; i < previous.length; i += 1) {
        combined.push([...previous[i]]);

        if (i < next.length && next[i] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            combined[i].push(next[i]!);
        }
    }

    for (i; i < next.length; i += 1) {
        if (next[i] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            combined.push([next[i]!]);
        }
    }

    return combined;
};

const printFunctionType = (request: FileMutationsRequest, combinedType: CombinedFunctionType) => {
    return [
        "(",
        combinedType.parameters
            ?.map((parameter, index) => `arg${index}: ${joinIntoType(new Set(), new Set(parameter), request)}`)
            .join(", "),
        ") => ",
        combinedType.returnValue?.length
            ? joinIntoType(new Set(), new Set(combinedType.returnValue), request)
            : findAliasOfTypes(request, ["void"]),
        ";",
    ].join("");
};
