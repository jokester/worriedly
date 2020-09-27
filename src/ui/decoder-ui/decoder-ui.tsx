import React, { useEffect, useMemo, useState } from 'react';
import { PaperPage } from '../paper-page/paper-page';
import { DecoderSteps } from './decoder-steps';
import { ImagePicker } from './image-scanner';
import { Result } from '@zxing/library';
import { Step1ImageScanner } from './step1-image-scanner';
import jsSha1 from 'js-sha1';
import { decodeStringToArrayBuffer } from '../../core/model/binary-conversion/conversion-es';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';

const logger = getLogLevelLogger(__filename, 'DEBUG');

export const DecoderUI: React.FC = props => {
  const [step, setStep] = useState(1);

  const decoded = useMemo(() => new Deferred<Result>(), []);

  useEffect(() => {
    decoded.then(
      async result => {
        logger.info('result', result, result.getText().length);
        const sha1 = jsSha1(decodeStringToArrayBuffer(result.getText()));
        logger.info('result sha1', sha1);
      },
      error => logger.error('error', error),
    );
  }, []);

  return (
    <>
      <hr className="mb-2" />
      <div className="unprintable">
        <DecoderSteps step={step} />
      </div>
      <PaperPage>
        <div className="w-full">{step === 1 && <Step1ImageScanner onResult={decoded} />}</div>
      </PaperPage>
    </>
  );
};
