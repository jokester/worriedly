import { EncodedQr, PipeSpec, RawFile } from './pipeline';
import { Either } from 'fp-ts/Either';
import { binaryConversion } from '../binary-conversion';
import { either } from 'fp-ts';
import { eitherChain } from '../../utils/fp-ts/either-chain';
import { CorrectionLevels, createQR, maxNumOfBytes } from '../qr/create-qr';
import jsSha1 from 'js-sha1';

interface IntermediateEncodeState {
  bytes: string;
}

export function finishPipeline(
  pipelineResult: IntermediateEncodeState,
  correctionLevel: CorrectionLevels,
): Either<string, EncodedQr> {
  const maxLen = maxNumOfBytes(correctionLevel);

  if (pipelineResult.bytes.length > maxLen) {
    return either.left(
      `Correction level "${correctionLevel}" can encode at most ${maxLen.toLocaleString()} bytes. You had ${pipelineResult.bytes.length.toLocaleString()}.`,
    );
  }

  return either.right<never, EncodedQr>({
    bytes: pipelineResult.bytes,
    sha1: jsSha1(binaryConversion.string.toArrayBuffer(pipelineResult.bytes)),
  });
}

export async function startPipeline(
  input: RawFile,
  todo: readonly PipeSpec[],
): Promise<Either<string, IntermediateEncodeState>> {
  if (input.inputBuffer.byteLength > 100 * 1024) {
    return either.left('File too big, a QR code can encode at most KBs of data.');
  }

  const current = await binaryConversion.arrayBuffer.toString(input.inputBuffer);

  return runPipeline(
    {
      bytes: current,
    },
    todo as PipeSpec[],
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
    (r) => runPipeline(r, todo.slice(1)),
  );
}

async function runStep(
  current: IntermediateEncodeState,
  step: PipeSpec,
): Promise<Either<string, IntermediateEncodeState>> {
  return either.left('todo');
}

async function encodeQr(i: IntermediateEncodeState) {}
