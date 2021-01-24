# data_buffers
DataBuffer and DataBitBuffer built on top of ArrayBuffers that grows when needed.

github: https://github.com/jbluepolarbear/data_buffers
npm: https://www.npmjs.com/package/data_buffers

# ArrayBufferProvider

Provides a pool of reusable ArrayBuffers and provides the functionality to convert an ArrayBuffer to and from a base 64 string.

# DataBuffer

A lightweight wrapper around DataView with the ability to grow the buffer as needed.

# DataBitBuffer

A Data Bit Buffer View built on top of DataBuffer. Allows reading and writing values of 1-32 bits.

Usage:

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
      console.log(sut.getInt8());
      testValues.shift();
    }

    for (i = 0; i < 7; ++i) {
      console.log(sut.getInt16());
      testValues.shift();
    }

    for (i = 0; i < 15; ++i) {
      console.log(sut.getInt32());
      testValues.shift();
    }

    for (i = 1; i < 15; ++i) {
      console.log(sut.getBits(i));
      testValues.shift();
    }