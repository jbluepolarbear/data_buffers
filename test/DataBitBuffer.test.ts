import { bitsRequired, DataBitBuffer } from '../src/DataBitBuffer';
import { DataBuffer } from '../src/DataBuffer';
import { ArrayBufferProvider } from '../src/ArrayBufferProvider';
import { expectNotNull } from './TestUtil';

const SystemUnderTest = () =>
  new DataBitBuffer(new DataBuffer(new ArrayBufferProvider()));
describe('DataBitBuffer', () => {
  it('can instantiate', () => {
    const sut = SystemUnderTest();
    expectNotNull(sut);
  });

  it('can get default length', () => {
    const sut = SystemUnderTest();
    expect(sut.length()).toEqual(0);
  });

  it('can setBits - 1 bit', () => {
    const sut = SystemUnderTest();
    const testValue = 1;
    sut.setBits(1, testValue);
    expect(sut.getOffset()).toEqual(1);
  });

  it('can getBits - 1 bit val 1', () => {
    const sut = SystemUnderTest();
    const testValue = 1;
    sut.setBits(1, testValue);
    sut.setOffset(0);
    expect(sut.getBits(1)).toEqual(testValue);
  });

  it('can getBits - 1 bit val 0', () => {
    const sut = SystemUnderTest();
    const testValue = 0;
    sut.setBits(1, 1);
    expect(sut.getOffset()).toEqual(1);
    sut.setOffset(0);
    sut.setBits(1, testValue);
    sut.setOffset(0);
    expect(sut.getBits(1)).toEqual(testValue);
  });

  it('can setBitsAtOffset - 1 bit', () => {
    const sut = SystemUnderTest();
    const testValue = 1;
    sut.setBits(1, testValue);
    sut.setBits(1, testValue);
    expect(sut.getOffset()).toEqual(2);
    const testValue2 = 0;
    sut.setOffset(0);
    sut.setBitsAtOffset(1, 1, testValue2);
    expect(sut.getBits(1)).toEqual(testValue);
    expect(sut.getBits(1)).toEqual(testValue2);
  });

  it('can getBitsAtOffset - 1 bit', () => {
    const sut = SystemUnderTest();
    const testValue = 1;
    sut.setBits(1, testValue);
    sut.setBits(1, testValue);
    expect(sut.getOffset()).toEqual(2);
    const testValue2 = 0;
    sut.setBitsAtOffset(1, 1, testValue2);
    expect(sut.getBitsAtOffset(1, 1)).toEqual(testValue2);
  });

  it('can setInt8', () => {
    const sut = SystemUnderTest();
    const testValue = -100;
    sut.setInt8(testValue);
    expect(sut.getOffset()).toEqual(8);
  });

  it('can getInt8 - -100', () => {
    const sut = SystemUnderTest();
    const testValue = -100;
    sut.setInt8(testValue);
    sut.setOffset(0);
    expect(sut.getInt8()).toEqual(testValue);
  });

  it('can getInt8 - 100', () => {
    const sut = SystemUnderTest();
    const testValue = 100;
    sut.setInt8(testValue);
    sut.setOffset(0);
    expect(sut.getInt8()).toEqual(testValue);
  });

  it('can setInt16', () => {
    const sut = SystemUnderTest();
    const testValue = -1000;
    sut.setInt16(testValue);
    expect(sut.getOffset()).toEqual(16);
  });

  it('can getInt16 - -1000', () => {
    const sut = SystemUnderTest();
    const testValue = -1000;
    sut.setInt16(testValue);
    sut.setOffset(0);
    expect(sut.getInt16()).toEqual(testValue);
  });

  it('can getInt16 - 1000', () => {
    const sut = SystemUnderTest();
    const testValue = 1000;
    sut.setInt16(testValue);
    sut.setOffset(0);
    expect(sut.getInt16()).toEqual(testValue);
  });

  it('can setInt32', () => {
    const sut = SystemUnderTest();
    const testValue = -1000000000;
    sut.setInt32(testValue);
    expect(sut.getOffset()).toEqual(32);
  });

  it('can getInt32 - -1000000000', () => {
    const sut = SystemUnderTest();
    const testValue = -1000000000;
    sut.setInt32(testValue);
    sut.setOffset(0);
    expect(sut.getInt32()).toEqual(testValue);
  });

  it('can getInt32 - 1000000000', () => {
    const sut = SystemUnderTest();
    const testValue = 1000000000;
    sut.setInt32(testValue);
    sut.setOffset(0);
    expect(sut.getInt32()).toEqual(testValue);
  });

  it('can get bitsRequired', () => {
    const testValue = 4294967295;
    const bits = bitsRequired(0, testValue);
    expect(bits).toEqual(32);
  });

  it('can get bitsRequired', () => {
    const testValue = 16777215;
    const bits = bitsRequired(0, testValue);
    expect(bits).toEqual(24);
  });

  it('can get bitsRequired', () => {
    const testValue = 1023;
    const bits = bitsRequired(0, testValue);
    expect(bits).toEqual(10);
  });

  it('can get bitsRequired', () => {
    const testValue = 511;
    const bits = bitsRequired(0, testValue);
    expect(bits).toEqual(9);
  });

  it('can get bitsRequired', () => {
    const testValue = 255;
    const bits = bitsRequired(0, testValue);
    expect(bits).toEqual(8);
  });

  it('can get bitsRequired', () => {
    const testValue = 127;
    const bits = bitsRequired(0, testValue);
    expect(bits).toEqual(7);
  });

  it('can get bitsRequired', () => {
    const testValue = 63;
    const bits = bitsRequired(0, testValue);
    expect(bits).toEqual(6);
  });

  it('can setIntRange', () => {
    const sut = SystemUnderTest();
    const maxValue = 1023;
    const testValue = 1023;
    sut.setIntRange(0, maxValue, testValue);
    expect(sut.getOffset()).toEqual(10);
  });

  it('can setIntRange', () => {
    const sut = SystemUnderTest();
    const maxValue = 2047;
    const testValue = 2047;
    sut.setIntRange(0, maxValue, testValue);
    expect(sut.getOffset()).toEqual(11);
  });

  it('can getIntRange', () => {
    const sut = SystemUnderTest();
    const maxValue = 1023;
    const testValue = 1023;
    sut.setIntRange(0, maxValue, testValue);
    sut.setOffset(0);
    expect(sut.getIntRange(0, maxValue)).toEqual(testValue);
  });

  it('can getIntRange', () => {
    const sut = SystemUnderTest();
    const maxValue = 2047;
    const testValue = 2047;
    sut.setIntRange(0, maxValue, testValue);
    sut.setOffset(0);
    expect(sut.getIntRange(0, maxValue)).toEqual(testValue);
  });

  it('can getIntRange', () => {
    const sut = SystemUnderTest();
    const minValue = 512;
    const maxValue = 2047;
    const testValue = 2047;
    sut.setIntRange(minValue, maxValue, testValue);
    sut.setOffset(0);
    expect(sut.getIntRange(minValue, maxValue)).toEqual(testValue);
  });

  it('can run full integration', () => {
    const arrayBufferProvider = new ArrayBufferProvider();
    const dataBuffer = new DataBuffer(arrayBufferProvider);
    const sut = new DataBitBuffer(dataBuffer);
    let i: number;
    let value: number;

    let testValues = [];
    // input
    for (i = 0; i < 7; ++i) {
      value = 1 << i;
      sut.setInt8(value);
      testValues.push(value);
    }

    for (i = 0; i < 7; ++i) {
      value = 1 << (i + 7);
      sut.setInt16(value);
      testValues.push(value);
    }

    for (i = 0; i < 15; ++i) {
      value = 1 << (i + 15 - 1);
      sut.setInt32(value);
      testValues.push(value);
    }

    for (i = 1; i < 15; ++i) {
      value = 1 << (i - 1);
      sut.setBits(i, value);
      testValues.push(value);
    }

    var packed = arrayBufferProvider.arrayBufferToTransportString({
      buffer: sut.getArrayBuffer(),
      length: sut.getArrayBufferOffset(),
    });

    var result = arrayBufferProvider.transportStringToArrayBuffer(packed);
    sut.loadBuffer(result);
    arrayBufferProvider.giveArrayBufferBack(result.buffer);
    sut.setOffset(0);

    for (i = 0; i < 7; ++i) {
      expect(sut.getInt8()).toEqual(testValues[0]);
      testValues.shift();
    }

    for (i = 0; i < 7; ++i) {
      expect(sut.getInt16()).toEqual(testValues[0]);
      testValues.shift();
    }

    for (i = 0; i < 15; ++i) {
      expect(sut.getInt32()).toEqual(testValues[0]);
      testValues.shift();
    }

    for (i = 1; i < 15; ++i) {
      expect(sut.getBits(i)).toEqual(testValues[0]);
      testValues.shift();
    }
  });
});
