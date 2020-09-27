import { DeepReadonly } from '@jokester/ts-commonutil/lib/type';
import { RawFile } from './types';

export enum PipeType {
  readBytes,
  assertQrCapacity,
  computeSHA1,

  //

  compressGzip,
  decompressGzip,

  compressBrotli,
  decompressBrotli,
}

export interface PipeSpec {
  type: PipeType;

  qrLevel?: 'H';
}

export interface IntermediateEncodeState {
  /**
   * bytes as a UCS-2 string, where every codepoint is in range [0, 255], and string#length is #bytes
   */
  bytes: string;

  sha1?: string;
}

export type EncodePipelineState = DeepReadonly<{
  start: RawFile;
  current: IntermediateEncodeState;
}>;
