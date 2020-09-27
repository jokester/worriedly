import { IntermediateEncodeState, EncodePipelineState, PipeSpec } from './encode-pipeline';
import { Either } from 'fp-ts/Either';
import { either } from 'fp-ts';
import { eitherChain } from '../../utils/fp-ts/either-chain';
import { RawFile, RawQr } from './types';
import { binaryConversion } from './binary-conversion';

export async function startPipeline(input: RawFile, todo: readonly PipeSpec[]): Promise<Either<string, RawQr>> {
  const current = await binaryConversion.arrayBuffer.toString(input.inputBuffer);

  return either.left('todo');
}

export async function runPipeline(
  s: EncodePipelineState,
  todo: PipeSpec[],
): Promise<Either<string, EncodePipelineState>> {
  if (!todo.length) {
    return either.right(s);
  }

  return eitherChain.tasksT(
    () => runStep(s.current, todo[0]),
    (r) => runPipeline(s, todo.slice(1)),
  );
}

async function runStep(
  current: IntermediateEncodeState,
  step: PipeSpec,
): Promise<Either<string, IntermediateEncodeState>> {
  return either.left('todo');
}
