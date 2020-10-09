import React from 'react';
import { PipeSpec, PipeType } from '../../core/model/pipeline';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { maxNumOfBytes } from '../../core/model/render-pipeline';

const logger = getLogLevelLogger(__filename, 'debug');

const encoderPresetSlugs = {
  none: 'none',
} as const;

export interface EncoderPreset {
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

