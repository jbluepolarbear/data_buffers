import { DataBuffer } from './data_buffer';

export class DataBitBuffer {
  __offset: number = 0;
  __loadedLimit: number = 0;
  __view: DataBuffer;

  constructor(dataBuffer: DataBuffer) {
    this.__view = dataBuffer;
  }

  length() {
    return this.__view.length() * 8;
  }

  getArrayBuffer() {
    return this.__view.getArrayBuffer();
  }

  getArrayBufferOffset() {
    return this.__view.getOffset();
  }

  loadLimit() {
    return this.__loadedLimit;
  }

  reset() {
    this.__view.reset();
    this.setOffset(0);
    this.__loadedLimit = 0;
  }

  setOffset(offset: number) {
    this.__offset = offset;
  }

  getOffset() {
    return this.__offset;
  }

  loadBuffer(buffer: ArrayBuffer, size: number | null) {
    this.reset();

    this.__view.loadBuffer(buffer, size);

    this.__offset = this.__view.loadLimit() * 8;
    this.__loadedLimit = this.__offset;

    return this;
  }

  getBitAtOffset(offset: number) {
    const size = 1;

    const bufferOffset = Math.floor(offset / 8);

    let intValue = 0;
    if (
      bufferOffset < this.__view.getOffset() &&
      this.__view._canReadAt(bufferOffset, size)
    ) {
      intValue = this.__view.getByteAtOffset(bufferOffset) >>> 0;
    } else {
      intValue = this.__view.getByte() >>> 0;
    }

    const bitOffset = offset % 8;

    const bitValue = !!((1 << (8 - bitOffset - 1)) & intValue) ? 1 : 0;

    return bitValue;
  }

  setBitAtOffset(offset: number, bitValue: number) {
    const size = 1;

    bitValue = !!bitValue ? 1 : 0;

    const bufferOffset = Math.floor(offset / 8);

    let intValue = 0 >>> 0;
    if (this.__view._canReadAt(bufferOffset, size)) {
      intValue = this.__view.getByteAtOffset(bufferOffset) >>> 0;
    }

    const bitOffset = offset % 8;

    intValue |= ((1 & bitValue) << (8 - bitOffset - 1)) >>> 0;

    if (bufferOffset < this.__view.getOffset()) {
      this.__view.setByteAtOffset(bufferOffset, intValue);
    } else {
      this.__view.setByte(intValue);
    }

    return this;
  }

  getBitsAtOffset(offset: number, count: number) {
    let intValue = 0 >>> 0;

    for (let i = 0; i < count; ++i) {
      intValue |= (this.getBitAtOffset(offset + i) << (count - i - 1)) >>> 0;
    }

    return intValue;
  }

  setBitsAtOffset(offset: number, count: number, value: number) {
    for (let i = 0; i < count; ++i) {
      this.setBitAtOffset(
        offset + i,
        ((1 << (count - i - 1)) >>> 0) & (value >>> 0)
      );
    }

    return this;
  }

  getBits(count: number) {
    const intValue = this.getBitsAtOffset(this.__offset, count);
    this.__offset += count;

    return intValue;
  }

  setBits(count: number, value: number) {
    this.setBitsAtOffset(this.__offset, count, value);
    this.__offset += count;

    return this;
  }

  setBool(boolValue: boolean) {
    const size = 1;
    return this.setBits(size, boolValue ? 1 : 0);
  }

  getBool() {
    const size = 1;
    return this.getBits(size) > 0;
  }

  setInt8(intValue: number) {
    const size = 8;
    return this.setBits(size, intValue);
  }

  getInt8() {
    const size = 8;
    return this.getBits(size);
  }

  setInt16(intValue: number) {
    const size = 16;
    return this.setBits(size, intValue);
  }

  getInt16() {
    const size = 16;
    return this.getBits(size);
  }

  setInt32(intValue: number) {
    const size = 32;
    return this.setBits(size, intValue);
  }

  getInt32() {
    const size = 32;
    return this.getBits(size);
  }

  setIntRange(min: number, max: number, intValue: number) {
    assert(min < max);
    assert(intValue >= min);
    assert(intValue <= max);

    const bits = bitsRequired(min, max);
    const value = (intValue - min) >>> 0;
    this.setBits(bits, value);
  }

  getIntRange(min: number, max: number) {
    assert(min < max);
    const bits = bitsRequired(min, max);
    const value = this.getBits(bits);
    const intValue = value + min;
    return intValue;
  }

  unsignedRangeBitsLimit(rangeBits: number[]) {
    assert(rangeBits.length > 0);
    let rangeLimit = 0;
    for (let i = 0; i < rangeBits.length - 1; ++i) {
      rangeLimit += powerOf2(rangeBits[i]);
    }
    return rangeLimit;
  }

  setUnsignedRangeBits(rangeBits: number[], value: number) {
    assert(rangeBits.length > 0);
    let rangeMin = 0;
    let index = 0;
    for (index = 0; index < rangeBits.length; ++index) {
      const rangeMax = rangeMin + powerOf2(rangeBits[index]) - 1;
      const inRange = value <= rangeMax;
      this.setBool(inRange);
      if (inRange) {
        this.setIntRange(rangeMin, rangeMax, value);
        return this;
      }
      rangeMin += powerOf2(rangeBits[index]);
    }

    this.setIntRange(
      rangeMin,
      rangeMin + powerOf2(rangeBits[index]) - 1,
      value
    );
    return this;
  }

  getUnsignedRangeBits(rangeBits: number[]) {
    assert(rangeBits.length > 0);
    let rangeMin = 0;
    let index = 0;
    for (index = 0; index < rangeBits.length; ++index) {
      const rangeMax = rangeMin + powerOf2(rangeBits[index]) - 1;
      const inRange = this.getBool();
      if (inRange) {
        return this.getIntRange(rangeMin, rangeMax);
      }
      rangeMin += powerOf2(rangeBits[index]);
    }

    return this.getIntRange(
      rangeMin,
      rangeMin + powerOf2(rangeBits[index]) - 1
    );
  }

  _canRead(requestedSize: number) {
    if (
      (this.__offset >= this.__loadedLimit &&
        this.__offset + requestedSize <= this.length()) ||
      this.__offset + requestedSize <= this.__loadedLimit
    ) {
      return true;
    }

    return false;
  }

  _canReadAt(offset: number, requestedSize: number) {
    if (
      (offset >= this.__loadedLimit &&
        offset + requestedSize <= this.length()) ||
      offset + requestedSize <= this.__loadedLimit
    ) {
      return true;
    }

    return false;
  }
}

function bitsRequired(min: number, max: number) {
  return min === max ? 0 : Math.floor(Math.log(max - min) / Math.log(2) + 1.0);
}

function powerOf2(power: number) {
  return Math.pow(2, power);
}

function assert(condition: boolean, message?: string) {
  if (!condition) {
    if (!message) {
      message = '';
    }
    throw new Error('Assertion Failed: ' + message);
  }
}
