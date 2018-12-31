export class LazyCache<T> {
    private value?: T;

    public constructor(private readonly getter: () => T) {}

    public get(): T {
        if (this.value === undefined) {
            this.value = this.getter();
        }

        return this.value;
    }

    public clear(): void {
        this.value = undefined;
    }
}
