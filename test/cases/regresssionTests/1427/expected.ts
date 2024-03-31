import ts from "typescript";

(function () {
	interface FunctionCallType {
		parameters?: (ts.Type | undefined)[];
		returnValue?: ts.Type;
	}
	interface CombinedFunctionType {
		parameters: ts.Type[][];
		returnValue?: ts.Type[];
	}

	const functionCallTypes: FunctionCallType[] = [];
	const combinedType = functionCallTypes.reduce<CombinedFunctionType>(
		(accumulator, functionCallType) => {
			return {
				parameters: combineParameters(
					undefined,
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

	const combineParameters = (
		request: unknown,
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

	const collectOptionals = <T>(
		...arrays: (readonly T[] | undefined)[]
	): T[] => {
		const results: T[] = [];

		for (const array of arrays) {
			if (array !== undefined) {
				results.push(...array);
			}
		}

		return results;
	};

	const isNotUndefined = <T>(item: T | undefined): item is T =>
		item !== undefined;
})();
