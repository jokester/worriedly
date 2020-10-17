import { ArgumentParser } from 'argparse';
import { encodeBuffer } from '../core/node/creating-qr';
import { renderQr } from '../core/model/render-pipeline';
import { getWinstonLogger } from '@jokester/ts-commonutil/lib/logging/winston-logger';
import { fsp, readStream } from '@jokester/ts-commonutil/lib/node';

const logger = getWinstonLogger(__filename, 'debug');

export async function worriedlyPrintQr(argv: string[]) {
  const options = parseOptions(argv);
  console.log(options);
  await worriedlyPrintQrMain(options);
}

/**
 * html: a html with static resources embedded
 * gif: a gif
 */
export enum SupportedOutputFormat {
  html = 'html',
  gif = 'gif',
}

export interface PrintQrOptions {
  inputFile?: string;
  outputFile?: string;
  verbose?: boolean;

  outputFormat?: 'html' | 'gif';
}

export function parseOptions(argv: string[]): PrintQrOptions {
  const parser = new ArgumentParser({
    version: '0.0.0',
    addHelp: true,
    description: 'TODO: print-qr',
  });

  parser.addArgument(['-i', '--input-file'], {
    dest: 'inputFile',
    metavar: 'INPUT_FILENAME',
    help: 'Input file to read bytes from. Will read from STDIN if unspecified.',
  });

  parser.addArgument(['-o', '--output-file'], {
    dest: 'outputFile',
    metavar: 'FILENAME',
    help: 'Output file to write to. Will write to STDOUT if unspecified.',
  });

  parser.addArgument(['-f', '--output-format'], {
    dest: 'outputFile',
    metavar: 'FORMAT',
    help: '',
  });

  parser.addArgument(['--verbose'], {
    defaultValue: false,
    action: 'storeTrue',
    dest: 'verbose',
    help: `Enable verbose log. Most for development use.`,
  });

  return parser.parseArgs(argv) as PrintQrOptions;
}

async function worriedlyPrintQrMain(options: PrintQrOptions) {
  const inputBytes: Buffer = options.inputFile
    ? (((await fsp.readFile(options.inputFile, { encoding: 'buffer' })) as unknown) as Buffer)
    : await readStream(process.stdin);

  logger.info('NEED TO BE WRITTEN');
  if (1) {
    process.exit(1);
  }

  // TODO: should warn user of capacity/err correcation level of QR codepac
  logger.info('got %d bytes', inputBytes.length);
  logger.info('got %o', inputBytes);

  const outputFormat = inferOutputFormat(options.outputFormat, options.outputFile);
  const { moduleCount, gifDataUri } = await renderQr(encodeBuffer(inputBytes), 'H');

  logger.info('genereated moduleCount=%d', moduleCount);
  logger.info('generated data uri of %d chars', gifDataUri.length);
  await fsp.writeFile('debug-out.gif.datauri', gifDataUri);

  const gifBytesBase64 = gifDataUri.slice('data:image/gif;base64,'.length);
  const gifBytes = Buffer.from(gifBytesBase64, 'base64');

  await fsp.writeFile('debug-out.gif', gifBytes);
}

export function inferOutputFormat(
  specifiedFormat: undefined | string,
  specifiedOutputFilename: undefined | string,
): SupportedOutputFormat {
  if (specifiedFormat) {
    if (/^(htm|html)$/i.test(specifiedFormat)) return SupportedOutputFormat.html;
    else if (/^gif$/i.test(specifiedFormat)) return SupportedOutputFormat.gif;
    else throw new Error(`Cannot recognize output format. ${JSON.stringify(specifiedFormat)} was specified`);
  } else {
    if (!specifiedOutputFilename) /* stdin */ return SupportedOutputFormat.html;
    else if (/\.(htm|html)$/i.test(specifiedOutputFilename)) return SupportedOutputFormat.html;
    else if (/\.(gif)$/i.test(specifiedOutputFilename)) return SupportedOutputFormat.gif;
    else
      throw new Error(
        `Cannot infer output format from specified output filename ${JSON.stringify(
          specifiedOutputFilename,
        )}. Please specify one.`,
      );
  }
}
