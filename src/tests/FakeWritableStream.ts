import { Writable } from "stream";

export class FakeWritableStream extends Writable {
    // tslint:disable-next-line:prefer-function-over-method
    public _write() {}
}
