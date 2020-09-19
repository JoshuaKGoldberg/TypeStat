import { Writable } from "stream";

export class StubWritableStream extends Writable {
    public write() {
        return false;
    }

    public _write() {}

    public constructor(opts?: import("stream").WritableOptions) {
        super(opts);
        this.write = jest.fn();
    }
}
