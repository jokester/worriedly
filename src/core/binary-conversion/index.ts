import { decodeStringToArrayBuffer, encodeArrayBufferToString } from './conversion-es';
import { readBlobAsArrayBuffer } from './conversion-web';

export const binaryConversion = {
  arrayBuffer: {
    toString: encodeArrayBufferToString,
  },
  string: {
    toArrayBuffer: decodeStringToArrayBuffer,
  },
  blob: {
    toArrayBuffer: readBlobAsArrayBuffer,
    toString: (b: Blob) => readBlobAsArrayBuffer(b).then(encodeArrayBufferToString),
  },
  buffer: {
    // TODO
  },
} as const;
