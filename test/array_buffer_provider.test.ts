import { ArrayBufferProvider } from '../src/array_buffer_provider';
import { expectNotNull } from './test_util';

describe('ArrayBuffer Provider', () => {
  it('can instantiate', () => {
    const sut = new ArrayBufferProvider();
    expectNotNull(sut);
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

  it('can convert SizedArrayBuffer to Base64 encoded string', () => {
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
    const base64 = sut.arrayBufferToBase64({
      buffer: testArrayBuffer,
      length: requestedSize,
    });
    expectNotNull(base64);
    const sizedArrayBuffer = sut.base64ToArrayBuffer(base64);
    let outString = '';
    {
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
