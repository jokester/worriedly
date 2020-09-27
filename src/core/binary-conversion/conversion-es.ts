export function encodeArrayBufferToString(arrayBuffer: ArrayBuffer): string {
  /**
   * encode bytes into JS UCS-2 string
   * The char codes are used by qrcode like {@code stringEncodedBytes.charCodeAt(charIndex) & 0xff}
   * ([0, 255] range of byte is a subset of legal UCS-2 char code)
   */
  const uint8array = new Uint8Array(arrayBuffer);
  return String.fromCharCode(...uint8array);
}

/**
 * TODO: move to ts-commonutils
 * @param str bytes encoded as UCS-2 codepoints
 */
export function decodeStringToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const uint8View = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    uint8View[i] = str.codePointAt(i)!;
  }
  return buf;
}
