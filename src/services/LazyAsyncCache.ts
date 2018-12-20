export class LazyAsyncCache<T> {
    private value?: T;

    public constructor(
        private readonly getter: () => T,
    ) { }

    public async get(): Promise<T> {
        if (this.value === undefined) {
            this.value = await this.getter();
        }

        return this.value;
    }

    public clear(): void {
        this.value = undefined;
    }
}
