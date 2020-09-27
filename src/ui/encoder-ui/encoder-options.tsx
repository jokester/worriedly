import React, { useMemo, useState } from 'react';
import { InputData } from '../../core/types';
import { PipelineResult, PipeSpec } from '../../core/model/pipe-spec';
import { runPipeline } from "../../core/model/pipeline-runner";

export const EncoderOptions: React.FC<{ input: InputData; onFinish?(result: PipelineResult): void }> = (props) => {
  const [pipeline, setPipeline] = useState<PipeSpec[]>([]);

  const encoded = useMemo(() => runPipeline({current: props.input.inputBuffer}))
};
