import { Result } from '@zxing/library';
import { either } from 'fp-ts';
import { CorrectionLevels } from '../model/render-pipeline';
import ResultMetadataType from '@zxing/library/esm/core/ResultMetadataType';

export function readZxingResult(r: Result): either.Either<string, { level: CorrectionLevels; bytes: ArrayBuffer }> {
  const meta = r.getResultMetadata();
  const level = meta.get(ResultMetadataType.ERROR_CORRECTION_LEVEL) as CorrectionLevels;
  const byteSegments = meta.get(ResultMetadataType.BYTE_SEGMENTS) as undefined | Uint8Array[];

  console.debug('level', level);
  console.debug('byteSegments', byteSegments);

  if (
    ['H', 'Q', 'M', 'L'].includes(level as string) &&
    byteSegments?.length === 1 &&
    byteSegments[0] instanceof Uint8Array
  ) {
    const [byteSegment] = byteSegments;
    const bytes = new ArrayBuffer(byteSegment.byteLength);
    new Uint8Array(bytes).set(byteSegment);

    return either.right({
      level,
      bytes,
    });
  }

  return either.left('failed to recognize QR code');
}
