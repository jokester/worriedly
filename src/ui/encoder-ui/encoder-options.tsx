import React, { useMemo, useState } from 'react';
import { RawFile } from '../../core/model/types';
import { IntermediateEncodeState, PipeSpec } from '../../core/model/encode-pipeline';
import { runPipeline, startPipeline } from '../../core/model/encode-runner';

export const EncoderOptions: React.FC<{ input: RawFile; onFinish?(result: IntermediateEncodeState): void }> = (
  props,
) => {
  const [todo, setTodo] = useState<readonly PipeSpec[]>([]);

  const encoded = useMemo(() => startPipeline(props.input, todo), [props.input, todo]);

  return null;
};
