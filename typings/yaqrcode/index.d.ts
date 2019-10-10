/**
 * TypeScript types for https://github.com/zenozeng/node-yaqrcode
 */
declare module 'yaqrcode' {
  /**
   * upstream code: https://github.com/zenozeng/node-yaqrcode/blob/master/index.js
   * @see https://www.qrcode.com/en/about/version.html
   */
  interface Option {
    /**
     * @default 4
     */
    typeNumber?: number;
    /**
     * @default 'M'
     */
    errorCorrectLevel?: 'L' | 'M' | 'Q' | 'H';
    /**
     * @default 500
     */
    size?: number;
  }

  interface YaqrCode {
    (text: string, options?: Option): /* a data uri of gif bytes */ string;
  }

  const Y: YaqrCode;

  export = Y;
}
