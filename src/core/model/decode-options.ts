import { PipeType, TransformPreset } from './pipeline';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';

export const decodePresets: readonly TransformPreset[] & NonEmptyArray<TransformPreset> = [
  {
    name: 'do not decode',
    slug: 'none',
    pipeline: [],
  },
  {
    name: 'decompress gzip',
    slug: 'gunzip',
    pipeline: [{ type: PipeType.decompressGzip }],
  },
];
