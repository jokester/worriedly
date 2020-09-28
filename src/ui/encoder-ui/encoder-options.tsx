import React, { useEffect, useMemo, useState } from 'react';
import { finishPipeline, startPipeline } from '../../core/model/encode-pipeline';
import { EncodedQr, PipeSpec, PipeType, RawFile } from '../../core/model/pipeline';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { pipe } from 'fp-ts/function';
import { CorrectionLevels, maxNumOfBytes } from '../../core/qr/create-qr';
import { either } from 'fp-ts';
import { FormControl, FormLabel, Select } from '@chakra-ui/core';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';

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
    name: 'gzip',
    pipeline: [{ type: PipeType.compressGzip }],
  },
];

const correctionLevels = [
  {
    name: 'L',
    desc: `L: max ${maxNumOfBytes('L')} bytes`,
  },
  {
    name: 'M',
    desc: `M: max ${maxNumOfBytes('M')} bytes`,
  },
  {
    name: 'Q',
    desc: `Q: max ${maxNumOfBytes('Q')} bytes`,
  },
  {
    name: 'H',
    desc: `H: max ${maxNumOfBytes('H')} bytes`,
  },
] as const;

export const EncoderOptions: React.FC<{ input: RawFile; onFinish?(result: EncodedQr): void }> = (props) => {
  const [preset, setPreset] = useState<EncoderPreset>(encoderPresets[0]);
  const [level, setLevel] = useState<CorrectionLevels>('H');

  const encodedP = useMemo(() => startPipeline(props.input, preset.pipeline), [props.input, preset]);
  const encoded = usePromised(encodedP);

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
    <FormControl>
      <FormLabel>Preset</FormLabel>
      <Select
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
      </Select>
      <FormLabel>QR Correction Level</FormLabel>
      <Select
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
      </Select>
    </FormControl>
  );
};
