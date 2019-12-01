import { CorrectionLevels } from './create-qr';

export interface InputData {
  filename: string;
  inputBuffer: ArrayBuffer;
  contentType: string;
  sha1: string;
}

export enum DataFilters {
  none = 'none',
}

export interface QrOptions {
  filters: DataFilters[];
  filteredBytes: string; // inputBuffer filtered by a chain of filters
  errorCorrectionLevel: CorrectionLevels;
}