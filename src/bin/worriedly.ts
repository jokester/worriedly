import { worriedlyPrintQr } from './worriedly-print-qr';

export async function cliMain() {
  const args = process.argv.slice();

  const [nodeBin, worriedBin, subCommand, ...rest] = args;

  console.debug('worriedly started', args);

  switch (subCommand) {
    case 'print-qr':
      return await worriedlyPrintQr(rest);
    case undefined:
      throw 'no subcommand specified';
  }
}

/**
 * to use with 'npm start:ts' script
 */
if (require.main === module) {
  setTimeout(cliMain);
}
