import React, { useEffect, useMemo, useState } from 'react';
import { finishPipeline, startPipeline } from '../../core/model/encode-pipeline';
import { EncodedQr, PipeSpec, RawFile } from '../../core/model/pipeline';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { pipe } from 'fp-ts/function';
import { CorrectionLevels, maxNumOfBytes } from '../../core/qr/create-qr';
import { either } from 'fp-ts';

const logger = getLogLevelLogger(__filename, 'debug');

interface EncoderPreset {
  name: string;
  pipeline: PipeSpec[];
}

const encoderPresets: readonly EncoderPreset[] & NonEmptyArray<EncoderPreset> = [
  {
    name: 'no processing',
    pipeline: [],
  },
  {
    name: 'no processing -2',
    pipeline: [],
  },
];

const correctionLevels = [
  {
    name: 'L',
    desc: `max ${maxNumOfBytes('L')} bytes`,
  },
  {
    name: 'M',
    desc: `max ${maxNumOfBytes('M')} bytes`,
  },
  {
    name: 'Q',
    desc: `max ${maxNumOfBytes('Q')} bytes`,
  },
  {
    name: 'H',
    desc: `max ${maxNumOfBytes('H')} bytes`,
  },
] as const;

export const EncoderOptions: React.FC<{ input: RawFile; onFinish?(result: EncodedQr): void }> = (props) => {
  const [preset, setPreset] = useState<EncoderPreset>(encoderPresets[0]);
  const [level, setLevel] = useState<CorrectionLevels>('H');

  const encodedP = useMemo(() => startPipeline(props.input, preset.pipeline), [props.input, preset]);
  // const encoded = usePromised(encodedP);

  useEffect(() => {
    startPipeline(props.input, preset.pipeline).then((result) => {
      const finalResult = pipe(
        result,
        either.map((right) => finishPipeline(right, level)),
        either.flatten,
      );
      logger.debug('EncodedOptions#pipeline result', result);
      logger.debug('EncodedOptions#final result', finalResult);
    });
  }, [props.input, preset, level]);

  return (
    <div>
      <div>
        <label>pipeline</label>
        <select
          value={preset.name}
          onChange={(ev) => {
            const found = encoderPresets.find((_) => _.name === ev.target.value);
            found && setPreset(found);
          }}
        >
          {encoderPresets.map((o, i) => (
            <option value={o.name} key={i}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label> QR Correction Level</label>
        <select
          value={level}
          onChange={(ev) => {
            const found = correctionLevels.find((_) => _.name === ev.target.value);
            found && setLevel(found.name);
          }}
        >
          {correctionLevels.map((o, i) => (
            <option value={o.name} key={i}>
              {o.desc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
