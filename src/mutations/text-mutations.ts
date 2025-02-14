import { TextInsertMutation, TextSwapMutation } from "automutate";

export const textInsert = (
	insertion: string,
	begin: number,
): TextInsertMutation => {
	return {
		insertion,
		range: {
			begin,
		},
		type: "text-insert",
	};
};

export const textSwap = (
	insertion: string,
	begin: number,
	end: number,
): TextSwapMutation => {
	return {
		insertion,
		range: {
			begin,
			end,
		},
		type: "text-swap",
	};
};
