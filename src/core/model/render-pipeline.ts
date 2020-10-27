import qrcode from 'qrcode-generator';
import type { EncodedFile, RenderedFile } from './pipeline';

export type CorrectionLevels = 'H' | 'Q' | 'M' | 'L';

export interface QrRendition {
  readonly moduleCount: number;
  readonly gifDataUri: string;
}

export function createQR(encoded: EncodedFile, level: CorrectionLevels): RenderedFile {
  return {
    ...encoded,
    rendered: renderQr(encoded.encoded.bytes, level),
  };
}

export function renderQr(encodedBytes: string, errorCorrectionLevel: CorrectionLevels): QrRendition {
  throwIfLengthExceeded(errorCorrectionLevel, encodedBytes.length);

  const qr = qrcode(0, errorCorrectionLevel);

  qr.addData(encodedBytes, 'Byte');
  qr.make();

  const moduleCount = qr.getModuleCount();

  const gifDataUri = qr.createDataURL(1, 0);

  return {
    moduleCount,
    gifDataUri,
  } as const;
}

export function maxNumOfBytes(errorCorrectionLevel: CorrectionLevels): number {
  // see https://www.qrcode.com/en/about/version.html
  switch (errorCorrectionLevel) {
    case 'L':
      return 23648 >>> 3;
    case 'M':
      return 18672 >>> 3;
    case 'Q':
      return 13328 >>> 3;
    case 'H':
      return 10208 >>> 3;
    default:
      return -1;
  }
}

export function throwIfLengthExceeded(level: CorrectionLevels, length: number) {
  const max = maxNumOfBytes(level);
  if (!(length <= max))
    throw new Error(`error correction level ${level} can encode at most ${max} bytes. provided ${length} bytes`);
}
