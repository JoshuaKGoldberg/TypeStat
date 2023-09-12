/**
 * Generates new names that are unique per file.
 */
export class NameGenerator {
	private readonly countsPerBase = new Map<string, number>();

	public constructor(private readonly sourceFileName: string) {}

	public generateName(base: string) {
		const existingCount = this.countsPerBase.get(base);

		if (existingCount === undefined) {
			this.countsPerBase.set(base, 1);
			return `${this.sourceFileName}${base}`;
		}

		this.countsPerBase.set(base, existingCount + 1);
		return `${this.sourceFileName}${base}${existingCount + 1}`;
	}
}
