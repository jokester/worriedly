import { DecodedFile, RecognizedFile, TransformPreset } from './pipeline';
import { Either } from 'fp-ts/Either';
import { either } from 'fp-ts';

export async function decodeFile(
  recognized: RecognizedFile,
  preset?: TransformPreset | null,
): Promise<Either<string, DecodedFile>> {
  console.debug('decodeFile', recognized, preset);

  if (!preset) {
    return either.left('decode options not specified');
  }
  if (preset.pipeline.length) {
    return either.left('decode options not supported yet');
  }

  return either.right({
    ...recognized,
    decodePreset: preset,
    decoded: {
      ...recognized.encoded,
    },
  });
}
