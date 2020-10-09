import React, { useEffect, useMemo, useState } from 'react';
import { finishPipeline, startPipeline } from '../../core/model/encode-pipeline';
import { EncodedQr, PipeSpec, PipeType, RawFile } from '../../core/model/pipeline';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { pipe } from 'fp-ts/function';
import { CorrectionLevels, maxNumOfBytes } from '../../core/qr/create-qr';
import { either } from 'fp-ts';
import { FormControl, FormLabel, Select } from '@chakra-ui/core';
import { Either } from 'fp-ts/Either';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';

const logger = getLogLevelLogger(__filename, 'debug');

const encoderPresetSlugs = {

  none: 'none',


} as const;

interface EncoderPreset {
  name: string;
  slug: string;
  pipeline: PipeSpec[];
}

export const encoderPresets: readonly EncoderPreset[] & NonEmptyArray<EncoderPreset> = [
  {
    name: 'do not encode',
    slug: 'none',
    pipeline: [],
  },
  {
    name: 'gzip (TODO)',
    slug: 'gzip',
    pipeline: [{ type: PipeType.compressGzip }],
  },
];

export const correctionLevels = [
  {
    name: 'L',
    desc: `L: up to ${maxNumOfBytes('L').toLocaleString()} bytes`,
  },
  {
    name: 'M',
    desc: `M: up to ${maxNumOfBytes('M').toLocaleString()} bytes`,
  },
  {
    name: 'Q',
    desc: `Q: up to ${maxNumOfBytes('Q').toLocaleString()} bytes`,
  },
  {
    name: 'H',
    desc: `H: up to ${maxNumOfBytes('H').toLocaleString()} bytes`,
  },
] as const;

export async function transformFile(
  f: RawFile,
  preset: EncoderPreset,
  level: CorrectionLevels,
): Promise<Either<string, EncodedQr>> {
  const transformed = await startPipeline(f, preset.pipeline);
  return pipe(
    transformed,
    either.map((right) => finishPipeline(right, level)),
    either.flatten,
  );
}
