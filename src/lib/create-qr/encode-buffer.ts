export function encodeBuffer(buffer: Buffer): string {
  /**
   * encode bytes into JS UCS-2 string
   * The char codes are used by qrcode like {@code stringEncodedBytes.charCodeAt(charIndex) & 0xff}
   * ([0, 255] range of byte is a subset of legal UCS-2 char code)
   */
  const stringEncodedBytes = String.fromCharCode(...buffer.toJSON().data);
  return stringEncodedBytes;
}
