import { QrRendition } from './render-pipeline';
import { EncoderPreset } from '../../ui/encoder-ui/encoder-options';

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
}

export interface RawFile {
  filename: string;
  contentType: string;
  raw: {
    inputBuffer: ArrayBuffer;
    sha1: string;
  };
  encodePreset: EncoderPreset;
}

export interface EncodedFile extends RawFile {
  encoded: {
    bytes: string;
    sha1: string;
  };
}

export interface RenderedFile extends EncodedFile {
  rendered: QrRendition;
}
