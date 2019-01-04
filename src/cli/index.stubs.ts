import { Writable } from "stream";

export class StubWritableStream extends Writable {
    public readonly write = jest.fn();

    // tslint:disable-next-line:prefer-function-over-method
    public _write() {}
}
