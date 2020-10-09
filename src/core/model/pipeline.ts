import { QrRendition } from '../qr/create-qr';

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

export interface RawFile {
  filename: string;
  inputBuffer: ArrayBuffer;
  contentType: string;
  sha1: string;
}

export interface EncodedQr {
  bytes: string;
  sha1: string;
}

export interface RenderedQR extends EncodedQr {
  rendition: QrRendition;
}

export interface RawQr {
  bytes: string;
}

export interface DecodedFile {
  filename: string;

  sha1: string;
}
