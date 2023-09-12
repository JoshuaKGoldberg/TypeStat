import { enumValues } from "../enumValues.js";
import { promptIfNotProvided } from "./promptIfNotProvided.js";

export async function promptIfNotProvidedSelect<
	Enum extends Record<string, string>,
>(provided: string | undefined, stringEnum: Enum, message: string) {
	return (await promptIfNotProvided(
		provided as keyof Enum | undefined,
		{
			choices: enumValues(stringEnum),
			message,
			type: "select",
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	)) as any; // TODO
}
