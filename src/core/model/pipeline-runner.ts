import { PipelineResult, PipelineState, PipeSpec } from './pipe-spec';
import { Either } from 'fp-ts/Either';
import { either } from 'fp-ts';
import { eitherChain } from '../../utils/fp-ts/either-chain';

export async function runPipeline(s: PipelineState): Promise<Either<string, PipelineState>> {
  if (!s.todo.length) {
    return either.right(s);
  }

  return eitherChain.tasksT(
    () => runStep(s.current, s.todo[0]),
    r => runPipeline({ current: r, todo: s.todo.slice(1) }),
  );
}

async function runStep(current: PipelineResult, step: PipeSpec): Promise<Either<string, PipelineResult>> {
  return either.left('todo');
}