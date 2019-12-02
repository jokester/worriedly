import qrcode from 'qrcode-generator';

/**
 * encode a node.js Buffer into JS UCS-2 string
 * The char codes are used by qrcode like {@code stringEncodedBytes.charCodeAt(charIndex) & 0xff}
 * ([0, 255] range of byte is a subset of legal UCS-2 char code)
 */
export function encodeBuffer(bytes: Buffer): string {
  return String.fromCharCode(...bytes.toJSON().data);
}
