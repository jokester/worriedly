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
  it('we can encode each to string', () => {
    for (let i = 0; i < 256; i++) {
      const char = String.fromCharCode(i);
      expect(char.charCodeAt(0) & 0xff).toEqual(i);
    }
  });
});
