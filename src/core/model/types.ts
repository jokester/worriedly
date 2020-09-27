import { CorrectionLevels } from '../qr/create-qr';

export interface RawFile {
  filename: string;
  inputBuffer: ArrayBuffer;
  contentType: string;
  sha1: string;
}

export interface RawQr {
  bytes: string;
  gifString: string;
}

export enum DataFilters {
  none = 'none',
}

export interface QrOptions {
  filters: DataFilters[];
  filteredBytes: string; // inputBuffer filtered by a chain of filters
  errorCorrectionLevel: CorrectionLevels;
}
