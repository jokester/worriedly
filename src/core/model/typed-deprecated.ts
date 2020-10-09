import { CorrectionLevels } from './render-pipeline';

/**
 * @deprecated
 */
export enum DataFilters {
  none = 'none',
}

/**
 * @deprecated
 */
export interface QrOptions {
  filters: DataFilters[];
  filteredBytes: string; // inputBuffer filtered by a chain of filters
  errorCorrectionLevel: CorrectionLevels;
}
