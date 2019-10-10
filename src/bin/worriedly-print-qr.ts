import { ArgumentParser } from 'argparse';
import * as fsp from '../ts-commonutil/node/fsp';
import { readStream } from '../ts-commonutil/node';
import { getWinstonLogger } from '../ts-commonutil/logging/winston-logger';

const logger = getWinstonLogger(__filename, 'debug');

export async function worriedlyPrintQr(argv: string[]) {
  const options = parseOptions(argv);
  console.log(options);
  await worriedlyPrintQrMain(options);
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
  const inputBytes = options.inputFile ? await fsp.readFile(options.inputFile, { encoding: 'buffer' }) : await readStream(process.stdin);
  if (!options.verbose) logger.silent = true;
  logger.error('got %d bytes', inputBytes.length);
  logger.error('got %o', inputBytes);
}
