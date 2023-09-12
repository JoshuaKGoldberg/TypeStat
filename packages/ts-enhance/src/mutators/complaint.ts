/**
 * Error and nested mutation path from a runtime failure.
 */
export class MutationsComplaint {
	public constructor(
		public readonly error: Error,
		public readonly mutatorPath: readonly string[],
	) {}

	public static wrapping(
		mutatorName: string,
		subComplaint: MutationsComplaint,
	) {
		return new MutationsComplaint(subComplaint.error, [
			mutatorName,
			...subComplaint.mutatorPath,
		]);
	}
}
