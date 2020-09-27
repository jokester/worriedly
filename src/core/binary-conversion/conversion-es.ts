/**
 * encode bytes {@type ArrayBuffer} into a UCS-2 JS string
 * The char codes are used by qrcode-generator like {@code stringEncodedBytes.charCodeAt(charIndex) & 0xff}
 *
 * UCS-2 string, where every codepoint is in range [0, 255], and string#length is #bytes*
 * ([0, 255] range of byte is a subset of legal UCS-2 char code)
 */
export function encodeArrayBufferToString(arrayBuffer: ArrayBuffer): string {
  const uint8array = new Uint8Array(arrayBuffer);
  return String.fromCharCode(...uint8array);
}

/**
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
