import { Writable } from "stream";


export class FakeWritableStream extends Writable {
    public _write() {}
}