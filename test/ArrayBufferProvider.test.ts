import { ArrayBufferProvider } from '../src/ArrayBufferProvider';
import { expectNotNull } from './TestUtil';

describe('ArrayBuffer Provider', () => {
  it('can instantiate', () => {
    const sut = new ArrayBufferProvider();
    expectNotNull(sut);
    expect(sut.getMinimumSize()).toEqual(1024);
  });

  it('can provide ArrayBuffer that fits size 256', () => {
    const sut = new ArrayBufferProvider();
    const requestedSize = 256;
    const arrayBuffer = sut.getArrayBufferThatFits(requestedSize);
    expectNotNull(arrayBuffer);
    expect(arrayBuffer.byteLength).toBeGreaterThanOrEqual(requestedSize);
  });

  it('can provide ArrayBuffer that fits big size 1000000', () => {
    const sut = new ArrayBufferProvider();
    const requestedSize = 1000000;
    const arrayBuffer = sut.getArrayBufferThatFits(requestedSize);
    expectNotNull(arrayBuffer);
    expect(arrayBuffer.byteLength).toBeGreaterThanOrEqual(requestedSize);
  });

  it('can provide ArrayBuffer that was given back', () => {
    const sut = new ArrayBufferProvider();
    const requestedSize = 256;
    const testArrayBuffer = new ArrayBuffer(requestedSize);
    sut.giveArrayBufferBack(testArrayBuffer);
    const arrayBuffer = sut.getArrayBufferThatFits(requestedSize);
    expectNotNull(arrayBuffer);
    expect(arrayBuffer).toEqual(testArrayBuffer);
  });

  it('can convert SizedArrayBuffer to transport string', () => {
    const sut = new ArrayBufferProvider();
    const testString = 'Hello World!';
    const requestedSize = testString.length;
    const testArrayBuffer = new ArrayBuffer(requestedSize);
    {
      const buffer = new Uint8Array(testArrayBuffer, 0, requestedSize);
      for (let i = 0; i < requestedSize; ++i) {
        buffer[i] = testString.charCodeAt(i);
      }
    }
    const transportString = sut.arrayBufferToTransportString({
      buffer: testArrayBuffer,
      length: requestedSize,
    });
    expectNotNull(transportString);

    const sizedArrayBuffer = sut.transportStringToArrayBuffer(transportString);
    let outString = '';
    if (!!sizedArrayBuffer.buffer) {
      const buffer = new Uint8Array(
        sizedArrayBuffer.buffer,
        0,
        sizedArrayBuffer.length
      );
      for (let i = 0; i < requestedSize; ++i) {
        outString += String.fromCharCode(buffer[i]);
      }
    }
    expect(outString).toEqual(testString);
  });
});
