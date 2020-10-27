import { EncodedFile, PipeSpec, RawFile, TransformPreset } from './pipeline';
import { Either } from 'fp-ts/Either';
import { binaryConversion } from '../binary-conversion';
import { either } from 'fp-ts';
import { CorrectionLevels, maxNumOfBytes } from './render-pipeline';
import jsSha1 from 'js-sha1';
import { pipe } from 'fp-ts/function';

export async function encodeFile(
  raw: RawFile,
  preset: TransformPreset,
  level: CorrectionLevels,
): Promise<Either<string, EncodedFile>> {
  const transformed = await startEncodePipeline(raw, preset.pipeline);
  return pipe(
    transformed,
    either.map((right) => finishEncoderPipeline(raw, right, level)),
    either.flatten,
  );
}

interface IntermediateEncodeState {
  bytes: string;
}

function finishEncoderPipeline(
  raw: RawFile,
  lastEncodeResult: IntermediateEncodeState,
  correctionLevel: CorrectionLevels,
): Either<string, EncodedFile> {
  const maxLen = maxNumOfBytes(correctionLevel);

  if (lastEncodeResult.bytes.length > maxLen) {
    return either.left(
      `Correction level "${correctionLevel}" can encode at most ${maxLen.toLocaleString()} bytes. You had ${lastEncodeResult.bytes.length.toLocaleString()}.`,
    );
  }

  return either.right<never, EncodedFile>({
    ...raw,
    encoded: {
      bytes: lastEncodeResult.bytes,
      sha1: jsSha1(binaryConversion.string.toArrayBuffer(lastEncodeResult.bytes)),
    },
  });
}

async function startEncodePipeline(
  input: RawFile,
  todo: readonly PipeSpec[],
): Promise<Either<string, IntermediateEncodeState>> {
  if (input.raw.inputBuffer.byteLength > 100 * 1024) {
    return either.left('File too big, a QR code can encode at most KBs of data.');
  }

  const current = binaryConversion.arrayBuffer.toString(input.raw.inputBuffer);

  return runPipeline(
    {
      bytes: current,
    },
    todo,
  );
}

async function runPipeline(
  s: IntermediateEncodeState,
  todo: readonly PipeSpec[],
): Promise<Either<string, IntermediateEncodeState>> {
  if (!todo.length) {
    return either.right(s);
  }

  const res = await runStep(s, todo[0]);
  if (either.isLeft(res)) return res;

  return runPipeline(res.right, todo.slice(1));
}

async function runStep(
  current: IntermediateEncodeState,
  step: PipeSpec,
): Promise<Either<string, IntermediateEncodeState>> {
  return either.left('todo');
}
