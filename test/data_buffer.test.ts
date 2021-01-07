import { ArrayBufferProvider } from "../src/array_buffer_provider";
import { DataBuffer } from "../src/data_buffer";
import { expectNotNull } from "./test_util";

describe('DataBuffer', () => {
    it('can instantiate', () => {
        const sut = new DataBuffer(new ArrayBufferProvider());
        expectNotNull(sut);
    });

    it('can get default length', () => {
        const sut = new DataBuffer(new ArrayBufferProvider());
        expect(sut.length()).toEqual(0);
    });

    it('can reset', () => {
        const sut = new DataBuffer(new ArrayBufferProvider());
        sut.__offset = 100;
        sut.reset();
        expect(sut.getOffset()).toEqual(0);
    });

    it('can setByte', () => {
        const sut = new DataBuffer(new ArrayBufferProvider());
        const testValue = 100;
        sut.setByte(testValue);
        expect(sut.getOffset()).toEqual(1);
    });

    it('can getByte', () => {
        const sut = new DataBuffer(new ArrayBufferProvider());
        const testValue = 100;
        sut.setByte(testValue);
        sut.setOffset(0);
        expect(sut.getByte()).toEqual(testValue);
    });

    it('can setByteAtOffset', () => {
        const sut = new DataBuffer(new ArrayBufferProvider());
        const testValue = 100;
        sut.setByte(testValue);
        sut.setByte(testValue);
        expect(sut.getOffset()).toEqual(2);
        const testValue2 = 35;
        sut.setOffset(0);
        sut.setByteAtOffset(1, testValue2);
        expect(sut.getByte()).toEqual(testValue);
        expect(sut.getByte()).toEqual(testValue2);
    });

    it('can getByteAtOffset', () => {
        const sut = new DataBuffer(new ArrayBufferProvider());
        const testValue = 100;
        sut.setByte(testValue);
        sut.setByte(testValue);
        expect(sut.getOffset()).toEqual(2);
        const testValue2 = 35;
        sut.setByteAtOffset(1, testValue2);
        expect(sut.getByteAtOffset(1)).toEqual(testValue2);
    });
});