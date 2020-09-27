import { EncodedQr, PipeSpec, RawFile } from './pipeline';
import { Either } from 'fp-ts/Either';
import { binaryConversion } from '../binary-conversion';
import { either } from 'fp-ts';
import { eitherChain } from '../../utils/fp-ts/either-chain';
import { pipe } from 'fp-ts/function';
import { CorrectionLevels, createQR, maxNumOfBytes } from '../qr/create-qr';
import jsSha1 from 'js-sha1';

interface IntermediateEncodeState {
  bytes: string;
  correctionLevel: CorrectionLevels;
}

export async function startPipeline(input: RawFile, todo: readonly PipeSpec[]): Promise<Either<string, EncodedQr>> {
  const current = await binaryConversion.arrayBuffer.toString(input.inputBuffer);

  const x = await runPipeline(
    {
      bytes: current,
      correctionLevel: 'H',
    },
    todo as PipeSpec[],
  );

  return pipe(
    x,
    either.map((pipelineResult) => {
      const maxLen = maxNumOfBytes(pipelineResult.correctionLevel);

      if (pipelineResult.bytes.length > maxLen) {
        return either.left(
          `Correction level "${pipelineResult.correctionLevel}" can encode at most ${maxLen} bytes. You had ${pipelineResult.bytes.length}.`,
        );
      }
      const rendition = createQR(pipelineResult.bytes, pipelineResult.correctionLevel);

      return either.right<never, EncodedQr>({
        rendition,
        bytes: pipelineResult.bytes,
        sha1: jsSha1(binaryConversion.string.toArrayBuffer(pipelineResult.bytes)),
      });
    }),
    either.flatten,
  );
}

async function runPipeline(
  s: IntermediateEncodeState,
  todo: PipeSpec[],
): Promise<Either<string, IntermediateEncodeState>> {
  if (!todo.length) {
    return either.right(s);
  }

  return eitherChain.tasksT(
    () => runStep(s, todo[0]),
    (r) => runPipeline(s, todo.slice(1)),
  );
}

async function runStep(
  current: IntermediateEncodeState,
  step: PipeSpec,
): Promise<Either<string, IntermediateEncodeState>> {
  return either.left('todo');
}

async function encodeQr(i: IntermediateEncodeState) {}
