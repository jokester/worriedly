import qrcode from 'qrcode-generator';

export function createQRFromBytes(bytes: Buffer, errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'H') {
  const qr = qrcode(0, errorCorrectionLevel);

  /**
   * encode bytes into JS UCS-2 string
   * The char codes are used by qrcode like {@code stringEncodedBytes.charCodeAt(charIndex) & 0xff}
   * ([0, 255] range of byte is a subset of legal UCS-2 char code)
   */
  const stringEncodedBytes = String.fromCharCode(...bytes.toJSON().data);

  qr.addData(stringEncodedBytes, 'Byte');
  qr.make();

  // TODO: what are better size for qr code (considering resolution for print/scan)
  const moduleCount = qr.getModuleCount();

  const gifDataUri = qr.createDataURL(1, 0);

  return {
    moduleCount,
    gifDataUri,
  };
}
