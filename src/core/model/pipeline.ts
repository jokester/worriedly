import type { CorrectionLevels, QrRendition } from './render-pipeline';

export enum PipeType {
  compressGzip,
  decompressGzip,

  compressBrotli,
  decompressBrotli,
}

export interface PipeSpec {
  type: PipeType;
}

export interface TransformPreset {
  name: string;
  slug: string;
  pipeline: PipeSpec[];
}

export interface RawFile {
  filename: string;
  contentType: string;
  raw: {
    inputBuffer: ArrayBuffer;
    sha1: string;
  };
  encodePreset: TransformPreset;
}

export interface EncodedFile extends RawFile {
  encoded: {
    bytes: string;
    sha1: string;
  };
}

export interface MultipleEncodedFile extends EncodedFile {
  segmented: { bytes: string; sha1: string }[];
}

export interface MultipleRenderedFile extends MultipleEncodedFile {
  renditions: QrRendition[];
}

export interface RenderedFile extends EncodedFile {
  rendered: QrRendition;
}

export interface RecognizedFile {
  encoded: {
    level: CorrectionLevels;
    buffer: ArrayBuffer;
    sha1: string;
  };
}

export interface DecodedFile extends RecognizedFile {
  decodePreset: TransformPreset;
  decoded: {
    buffer: ArrayBuffer;
    sha1: string;
  };
}
