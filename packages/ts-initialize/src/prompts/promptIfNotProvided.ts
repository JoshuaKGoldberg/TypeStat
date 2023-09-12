import { prompt } from "enquirer";

// TODO: Sigh.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromptOptions = any;

export async function promptIfNotProvided<
	Value,
	Options extends Omit<PromptOptions, "name">,
>(provided: Value | undefined, options: Options) {
	if (provided !== undefined) {
		return provided;
	}

	const { value } = await prompt<{ value: Value }>({
		...options,
		name: "value",
	} as PromptOptions);

	return value;
}
