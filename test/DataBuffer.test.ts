import { DataBuffer } from '../src/DataBuffer';
import { ArrayBufferProvider } from '../src/ArrayBufferProvider';
import { expectNotNull } from './TestUtil';

const SystemUnderTest = () => new DataBuffer(new ArrayBufferProvider());
describe('DataBuffer', () => {
  it('can instantiate', () => {
    const sut = SystemUnderTest();
    expectNotNull(sut);
  });

  it('can get default length', () => {
    const sut = SystemUnderTest();
    expect(sut.length()).toEqual(0);
  });

  it('can reset', () => {
    const sut = SystemUnderTest();
    sut.__offset = 100;
    sut.reset();
    expect(sut.getOffset()).toEqual(0);
  });

  it('can setByte', () => {
    const sut = SystemUnderTest();
    const testValue = 100;
    sut.setByte(testValue);
    expect(sut.getOffset()).toEqual(1);
  });

  it('can getByte', () => {
    const sut = SystemUnderTest();
    const testValue = 100;
    sut.setByte(testValue);
    sut.setOffset(0);
    expect(sut.getByte()).toEqual(testValue);
  });

  it('can setByteAtOffset', () => {
    const sut = SystemUnderTest();
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
    const sut = SystemUnderTest();
    const testValue = 100;
    sut.setByte(testValue);
    sut.setByte(testValue);
    expect(sut.getOffset()).toEqual(2);
    const testValue2 = 35;
    sut.setByteAtOffset(1, testValue2);
    expect(sut.getByteAtOffset(1)).toEqual(testValue2);
  });

  it('can setInt8', () => {
    const sut = SystemUnderTest();
    const testValue = -100;
    sut.setInt8(testValue);
    expect(sut.getOffset()).toEqual(1);
  });

  it('can getInt8', () => {
    const sut = SystemUnderTest();
    const testValue = -100;
    sut.setInt8(testValue);
    sut.setOffset(0);
    expect(sut.getInt8()).toEqual(testValue);
  });

  it('can setInt16', () => {
    const sut = SystemUnderTest();
    const testValue = -1000;
    sut.setInt16(testValue);
    expect(sut.getOffset()).toEqual(2);
  });

  it('can getInt16', () => {
    const sut = SystemUnderTest();
    const testValue = -1000;
    sut.setInt16(testValue);
    sut.setOffset(0);
    expect(sut.getInt16()).toEqual(testValue);
  });

  it('can setInt32', () => {
    const sut = SystemUnderTest();
    const testValue = -1000000000;
    sut.setInt32(testValue);
    expect(sut.getOffset()).toEqual(4);
  });

  it('can getInt32', () => {
    const sut = SystemUnderTest();
    const testValue = -1000000000;
    sut.setInt32(testValue);
    sut.setOffset(0);
    expect(sut.getInt32()).toEqual(testValue);
  });

  it('can setFloat32', () => {
    const sut = SystemUnderTest();
    const testValue = 3.141519;
    sut.setFloat32(testValue);
    expect(sut.getOffset()).toEqual(4);
  });

  it('can getFloat32', () => {
    const sut = SystemUnderTest();
    const testValue = 3.141519;
    sut.setFloat32(testValue);
    sut.setOffset(0);
    expect(Math.abs(sut.getFloat32() - testValue)).toBeLessThanOrEqual(
      0.000001
    );
  });

  it('can write and get values back', () => {
    const testValues = [100, -100, -1000, -1000000000, 3.141519];
    const sut = SystemUnderTest();
    sut.setByte(testValues[0]);
    sut.setInt8(testValues[1]);
    sut.setInt16(testValues[2]);
    sut.setInt32(testValues[3]);
    sut.setFloat32(testValues[4]);
    sut.setOffset(0);
    expect(sut.getByte()).toEqual(testValues[0]);
    expect(sut.getInt8()).toEqual(testValues[1]);
    expect(sut.getInt16()).toEqual(testValues[2]);
    expect(sut.getInt32()).toEqual(testValues[3]);
    expect(Math.abs(sut.getFloat32() - testValues[4])).toBeLessThanOrEqual(
      0.000001
    );
  });
});
