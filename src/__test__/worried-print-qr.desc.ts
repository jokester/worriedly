import { inferOutputFormat, SupportedOutputFormat } from '../bin/worriedly-print-qr';
describe('worried-print-qr', () => {
  it('parses option', () => {});

  it('infers output format', () => {
    expect(inferOutputFormat('', '')).toEqual(SupportedOutputFormat.html);

    expect(inferOutputFormat('gIf', 'a.html')).toEqual(SupportedOutputFormat.gif);
    expect(inferOutputFormat('html', undefined)).toEqual(SupportedOutputFormat.html);
    expect(() => inferOutputFormat('v.png', undefined)).toThrowError(/^cannot recognize/i);

    expect(inferOutputFormat('', 'a.htm')).toEqual(SupportedOutputFormat.html);
    expect(inferOutputFormat(undefined, 'b.Gif')).toEqual(SupportedOutputFormat.gif);
    expect(() => inferOutputFormat(undefined, 'x.svg')).toThrowError(/^cannot infer/i);
  });
});

describe('bytes', () => {
  it('we can encode a byte array to UCS-2 string and read it back', () => {
    const bytes = new Array(256).fill(-1).map((_, index) => index);

    const stringEncoded = String.fromCharCode(...bytes);
    expect(stringEncoded).toHaveLength(256);

    for (let i = 0; i < 256; i++) {
      const readBack = stringEncoded.charCodeAt(i) & 0xff; // same as in qrcode-generator
      expect(readBack).toEqual(bytes[i]);
    }
  });
});
