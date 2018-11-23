export class LazyValue<T>{
    private value: Promise<T> | undefined;
    
    public constructor(
        private readonly getter: () => Promise<T>,
    ) { }

    public get() {
        if (this.value === undefined) {
            this.value = this.getter();
        }

        return this.value;
    }

    public reset() {
        this.value = undefined;
    }
};
