import type { Result } from '@zxing/library';
import { either } from 'fp-ts';
import { CorrectionLevels } from '../model/render-pipeline';
import ResultMetadataType from '@zxing/library/esm/core/ResultMetadataType';
import { RecognizedFile } from '../model/pipeline';
import { pipe } from 'fp-ts/function';
import { duplicateArrayBuffer } from '../binary-conversion/conversion-es';
import jsSha1 from 'js-sha1';

interface RawZxingBytes {
  level: CorrectionLevels;
  bytes: ArrayBuffer;
}

function readZxingResultRaw(r: Result): either.Either<string, RawZxingBytes> {
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

export function readZxingResult(r: Result): either.Either<string, RecognizedFile> {
  return pipe(
    readZxingResultRaw(r),
    either.map((raw) => {
      const bytes = duplicateArrayBuffer(raw.bytes);
      const sha1 = jsSha1(bytes);

      return {
        encoded: {
          buffer: raw.bytes,
          sha1,
          level: raw.level,
        },
      };
    }),
  );
}
