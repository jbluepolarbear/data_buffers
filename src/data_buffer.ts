import { ArrayBufferProvider } from './array_buffer_provider';

export class DataBuffer {
    __arrayBufferProvider: ArrayBufferProvider;
    __offset: number = 0;
    __loadedLimit: number = 0;
    __buffer: ArrayBuffer | null = null;
    __view: DataView | null = null;
    constructor(arrayBufferProvider: ArrayBufferProvider) {
        this.__arrayBufferProvider = arrayBufferProvider;
    }

    _view(): DataView {
        return this.__view as DataView;
    }

    length(): number {
        return this.__buffer?.byteLength || 0;
    }

    loadLimit() {
        return this.__loadedLimit;
    }

    getArrayBuffer() {
        return this.__buffer;
    }

    reset() {
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
        
        if (!size) {
            size = buffer.byteLength;
        }
        
        if (size > this.length()) {
            this._growBuffer(size);
        }
        
        let src = new Uint8Array(buffer);
        let dst = new Uint8Array(this.__buffer as ArrayBuffer);
        // copy over data
        for (let i = 0; i < size; ++i) {
            dst[i] = src[i];
        }
        
        this.__offset = size;
        this.__loadedLimit = size;
        
        return this;
    }
    
    setByteAtOffset(offset: number, byteValue: number) {
        var size = 1;
        this._ensureWritableAt(offset, size);        
        this._view().setUint8(offset, byteValue);
        
        return this;
    };

    getByteAtOffset(offset: number) {
        var size = 1;
        if (!this._canReadAt(offset, size)) {
            throw "getByteAtOffset failed: buffer size would be exceeded";
        }
        
        var intValue = this._view().getUint8(offset);
        return intValue;
    };
    
    setByte(byteValue: number) {
        var size = 1;
        this._ensureWritable(size);
        
        this._view().setUint8(this.__offset, byteValue);
        this.__offset += size;
        this.__loadedLimit += size;
        
        return this;
    };
    
    getByte() {
        var size = 1;
        if (!this._canRead(size)) {
            throw "getByte failed: buffer size would be exceeded";
        }
        
        var intValue = this._view().getUint8(this.__offset);
        this.__offset += size;
        return intValue;
    };
    
    setInt8(intValue: number) {
        var size = 1;
        this._ensureWritable(size);
        
        this._view().setInt8(this.__offset, intValue);
        this.__offset += size;
        this.__loadedLimit += size;
        
        return this;
    };
    
    getInt8(): number {
        var size = 1;
        if (!this._canRead(size)) {
            throw "getInt8 failed: buffer size would be exceeded";
        }
        
        var intValue = this._view().getInt8(this.__offset);
        this.__offset += size;
        return intValue;
    };
    
    setInt16(intValue: number) {
        var size = 2;
        this._ensureWritable(size);
        
        this._view().setInt16(this.__offset, intValue);
        this.__offset += size;
        this.__loadedLimit += size;
        
        return this;
    };
    
    getInt16(): number {
        var size = 2;
        if (!this._canRead(size)) {
            throw "getInt16 failed: buffer size would be exceeded";
        }
        
        var intValue = this._view().getInt16(this.__offset);
        this.__offset += size;
        return intValue;
    };
    
    setInt32(intValue: number) {
        var size = 4;
        this._ensureWritable(size);        
        this._view().setInt32(this.__offset, intValue);
        this.__offset += size;
        this.__loadedLimit += size;
        
        return this;
    };
    
    getInt32(): number {
        var size = 4;
        if (!this._canRead(size)) {
            throw "getInt32 failed: buffer size would be exceeded";
        }
        
        var intValue = this._view().getInt32(this.__offset);
        this.__offset += size;
        
        return intValue;
    };
    
    setFloat32(floatValue: number) {
        var size = 4;
        this._ensureWritable(size);
        this._view().setFloat32(this.__offset, floatValue);
        this.__offset += size;
        this.__loadedLimit += size;
        
        return this;
    };
    
    getFloat32(): number {
        var size = 4;
        if (!this._canRead(size)) {
            throw "getFloat32 failed: buffer size would be exceeded";
        }
        
        var floatValue = this._view().getFloat32(this.__offset);
        this.__offset += size;
        
        return floatValue;
    };

    _getArrayBufferThatFits(bufferSize: number, oldBuffer: ArrayBuffer | null) {
        let buffer = this.__arrayBufferProvider.getArrayBufferThatFits(getNextPowerOf2(Math.floor(bufferSize)));
        
        if (oldBuffer instanceof ArrayBuffer) {
            let src = new Uint8Array(oldBuffer);
            let dst = new Uint8Array(buffer);
            for (let i = 0; i < src.byteLength; ++i) {
                // copy over data
                dst[i] = src[i];
            }
        }
        return buffer;
    }
    
    _giveArrayBufferBack(buffer: ArrayBuffer | null) {
        this.__arrayBufferProvider.giveArrayBufferBack(buffer);
    }
    
    _growBuffer(size: number) {
        let oldBuffer = this.__buffer;
        this.__buffer = this._getArrayBufferThatFits(size, oldBuffer);
        this.__view = new DataView(this.__buffer);
        this._giveArrayBufferBack(oldBuffer);
    }
    
    _ensureWritable(requestedSize: number): void {
        if (this.__offset + requestedSize <= this.length()) {
            return;
        }

        this._growBuffer(this.__offset + requestedSize);
    }
    
    _ensureWritableAt(offset: number, requestedSize: number): void {
        if (offset + requestedSize <= this.length()) {
            return;
        }
        
        this._growBuffer(offset + requestedSize);
    }
    
    _canRead(requestedSize: number) {
        if (this.__offset + requestedSize <= this.__loadedLimit) {
            return true;
        }
        
        return false;
    }
    
    _canReadAt(offset: number, requestedSize: number) {
        if ((offset >= this.__loadedLimit && offset + requestedSize <= this.__offset) || offset + requestedSize <= this.__loadedLimit) {
            return true;
        }
        
        return false;
    }
}

function getNextPowerOf2(n: number): number {
    if (n === 0) {
        return 1;
    }
    
    n -= 1;
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    n += 1;
    
    return n;
}