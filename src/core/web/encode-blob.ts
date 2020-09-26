export function encodeBlobToString(blob: Blob): Promise<string> {
  return readBlobAsArrayBuffer(blob).then(encodeArrayBufferToString);
}

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
 * @param blob
 */
export async function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  const fr = new FileReader();

  return new Promise<ArrayBuffer>((fulfill, reject) => {
    fr.onload = (ev) => fulfill(fr.result as ArrayBuffer);
    fr.onerror = fr.onabort = reject;
    fr.readAsArrayBuffer(blob);
  });
}

export function decodeStringToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const uint8View = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    uint8View[i] = str.codePointAt(i)!;
  }
  return buf;
}
