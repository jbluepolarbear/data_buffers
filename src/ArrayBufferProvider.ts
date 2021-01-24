import { SizedArrayBuffer } from './SizedArrayBuffer';

export class ArrayBufferProvider {
  __buffers: ArrayBuffer[];
  __minimumSize: number = 1024;
  constructor(minimumSize?: number) {
    this.__buffers = [];
    if (!!minimumSize) {
      this.__minimumSize = minimumSize;
    }
  }

  getMinimumSize(): number {
    return this.__minimumSize;
  }

  getArrayBufferThatFits(size: number): ArrayBuffer {
    let index = -1;
    let smallest = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < this.__buffers.length; ++i) {
      if (
        this.__buffers[i].byteLength >= size &&
        this.__buffers[i].byteLength < smallest
      ) {
        index = i;
        smallest = this.__buffers[i].byteLength;
      }
    }

    if (index < 0) {
      if (size < this.__minimumSize) {
        size = this.__minimumSize;
      }
      return new ArrayBuffer(size);
    }

    const buffer = this.__buffers[index];
    this.__buffers.splice(index, 1);

    return buffer;
  }

  giveArrayBufferBack(arrayBuffer: ArrayBuffer | null): void {
    if (!arrayBuffer) {
      return;
    }
    this.__buffers.push(arrayBuffer);
  }

  arrayBufferToTransportString(sizedArrayBuffer: SizedArrayBuffer): string {
    let binary = '';
    if (!sizedArrayBuffer.buffer) {
      return binary;
    }
    const buffer = new Uint8Array(
      sizedArrayBuffer.buffer,
      0,
      sizedArrayBuffer.length || sizedArrayBuffer.buffer.byteLength
    );
    const bufferSize = buffer.byteLength;
    const chars: number[] = [];
    for (let i = 0; i < bufferSize; ) {
      chars.push(((buffer[i++] & 0xff) << 8) | (buffer[i++] & 0xff));
    }
    return String.fromCharCode.apply(null, chars);
  }

  transportStringToArrayBuffer(transportString: string): SizedArrayBuffer {
    const transportSize = transportString.length;
    const bufferSize = transportSize * 2;
    const arrayBuffer = this.getArrayBufferThatFits(bufferSize);
    const buffer = new Uint8Array(arrayBuffer, 0, bufferSize);
    for (let i = 0, bi = 0; i < transportSize; ++i) {
      var char = transportString.charCodeAt(i);
      buffer[bi++] = char >>> 8;
      buffer[bi++] = char & 0xff;
    }
    return {
      buffer: buffer.buffer,
      length: bufferSize,
    };
  }
}
