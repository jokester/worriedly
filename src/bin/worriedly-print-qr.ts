import { ArgumentParser } from 'argparse';

export async function worriedlyPrintQr(argv: string[]) {
  const options = parseOptions(argv);
  console.log(options);
}

export interface PrintQrOptions {
  inputFile?: string;
  outputFile?: string;

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

  return parser.parseArgs(argv) as PrintQrOptions;
}

async function worriedlyPrintQrMain(options: PrintQrOptions) {}
