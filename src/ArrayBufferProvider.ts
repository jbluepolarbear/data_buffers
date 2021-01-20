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

  arrayBufferToBase64(sizedArrayBuffer: SizedArrayBuffer): string {
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
    for (let i = 0; i < bufferSize; ++i) {
      binary += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64: string): SizedArrayBuffer {
    const binaryStr = window.atob(base64);
    const bufferSize = binaryStr.length;
    const arrayBuffer = this.getArrayBufferThatFits(bufferSize);
    const buffer = new Uint8Array(arrayBuffer, 0, bufferSize);
    for (let i = 0; i < bufferSize; ++i) {
      buffer[i] = binaryStr.charCodeAt(i);
    }
    return {
      buffer: buffer.buffer,
      length: bufferSize,
    };
  }
}
