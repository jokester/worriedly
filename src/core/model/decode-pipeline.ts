import { DecodedFile, RecognizedFile, TransformPreset } from './pipeline';
import { Either } from 'fp-ts/Either';
import { either } from 'fp-ts';

export async function decodeFile(
  recognized: RecognizedFile,
  preset: TransformPreset,
): Promise<Either<string, DecodedFile>> {
  if (preset.pipeline.length) {
    return either.left('decode pipeline not supported');
  }

  return either.right({
    ...recognized,
    decodePreset: preset,
    decoded: {
      ...recognized.encoded,
    },
  });
}
