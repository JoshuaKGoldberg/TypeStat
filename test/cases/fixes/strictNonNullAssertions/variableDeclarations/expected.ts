export {};

type NullableString = string | null;
const nullableString = null as NullableString;
const requiredString: string = nullableString!;

function initialize(value: string | null | undefined) {
	const required: string = value!;
	let requiredLet: string = value!;
	var requiredVar: string = value!;
	const acceptsNull: string | null = value!;
	const acceptsUndefined: string | undefined = value!;
	const acceptsBoth: string | null | undefined = value;
	const inferred = value;
	const acceptsAnything: any = value;
	const acceptsUnknown: unknown = value;
	const asserted: string = value!;
	const conditional: string = (Math.random() ? value : "fallback")!;
	let withoutInitializer: string;
	if (value !== null && value !== undefined) {
		const narrowed: string = value;
	}
}

function initializeValid(value: string) {
	const required: string = value;
}

type C = string | null;
type B = { C: C } | null;
type A = { B: B } | null;
const nested = { B: { C: null } } as A;
const nestedString: string = nested!.B!.C!;
