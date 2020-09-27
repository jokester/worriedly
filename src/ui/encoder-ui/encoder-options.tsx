import React, { useMemo, useState } from 'react';
import { startPipeline } from '../../core/model/encode-pipeline';
import { EncodedQr, PipeSpec, RawFile } from '../../core/model/pipeline';

export const EncoderOptions: React.FC<{ input: RawFile; onFinish?(result: EncodedQr): void }> = (props) => {
  const [todo, setTodo] = useState<readonly PipeSpec[]>([]);

  const encoded = useMemo(() => startPipeline(props.input, todo), [props.input, todo]);

  return null;
};
