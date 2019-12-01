export interface QrMeta {
  filename: string;
  contentType: string;
  numBytes: number;
}

export interface QrEncodedFile extends QrMeta {
  encodedBytes: string;
  file: File;
}
