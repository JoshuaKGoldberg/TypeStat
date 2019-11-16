import { Writable } from "stream";

export class StubWritableStream extends Writable {
    public readonly write = jest.fn();

    public _write() {}
}
