import qrcode from 'qrcode-generator';

export type CorrectionLevels = Parameters<typeof qrcode>[1];

export function createQRFromBytes(encodedBytes: string, errorCorrectionLevel: CorrectionLevels = 'H') {
  throwIfLengthExceeded(errorCorrectionLevel, encodedBytes.length);

  const qr = qrcode(0, errorCorrectionLevel);

  qr.addData(encodedBytes, 'Byte');
  qr.make();

  // TODO: what are better size for qr code (considering resolution for print/scan)
  const moduleCount = qr.getModuleCount();

  const gifDataUri = qr.createDataURL(1, 0);

  return {
    moduleCount,
    gifDataUri,
  };
}

export function maxNumOfBytes(errorCorrectionLevel: CorrectionLevels) {
  // see https://www.qrcode.com/en/about/version.html
  switch (errorCorrectionLevel) {
    case 'L':
      return 23648;
    case 'M':
      return 18672;
    case 'Q':
      return 13328;
    case 'H':
      return 10208;
    default:
      return -1;
  }
}

export function throwIfLengthExceeded(level: CorrectionLevels, length: number) {
  const max = maxNumOfBytes(level);
  if (!(length <= max))
    throw new Error(`error correction level ${level} can encode at most ${max} bytes. provided ${length} bytes`);
}
