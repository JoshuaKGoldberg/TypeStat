import { combineMutations, TextSwapMutation } from "automutate";
import ts from "typescript";

import {
	collectOptionals,
	isNotUndefined,
} from "../../../../../shared/arrays.js";
import { FileMutationsRequest } from "../../../../../shared/fileMutator.js";
import { PropertySignatureWithStaticName } from "../../../../../shared/nodeTypes.js";
import { FunctionCallType } from "./collectAllFunctionCallTypes.js";

interface CombinedFunctionType {
	parameters: ts.Type[][];
	returnValue?: ts.Type[];
}

export const createFunctionCallTypesMutation = (
	request: FileMutationsRequest,
	allFunctionCallTypes: Map<
		PropertySignatureWithStaticName,
		FunctionCallType[]
	>,
) => {
	const mutations = Array.from(allFunctionCallTypes).map(
		([member, functionCallTypes]) => {
			return createFunctionCallTypeMutation(request, member, functionCallTypes);
		},
	);

	return mutations.length === 0 ? undefined : combineMutations(...mutations);
};

const createFunctionCallTypeMutation = (
	request: FileMutationsRequest,
	member: PropertySignatureWithStaticName,
	functionCallTypes: FunctionCallType[],
): TextSwapMutation => {
	const combinedType = functionCallTypes.reduce<CombinedFunctionType>(
		(accumulator, functionCallType) => {
			return {
				parameters: combineParameters(
					accumulator.parameters,
					functionCallType.parameters,
				),
				returnValue: collectOptionals(accumulator.returnValue, [
					functionCallType.returnValue,
				]).filter(isNotUndefined),
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

const combineParameters = (
	previous: ts.Type[][],
	next: (ts.Type | undefined)[] | undefined,
) => {
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

const printFunctionType = (
	request: FileMutationsRequest,
	combinedType: CombinedFunctionType,
) => {
	return [
		"(",
		combinedType.parameters
			.map(
				(parameter, index) =>
					`arg${index}: ${request.services.printers.type(parameter)}`,
			)
			.join(", "),
		") => ",
		combinedType.returnValue?.length
			? request.services.printers.type(combinedType.returnValue)
			: "void",
		";",
	].join("");
};
