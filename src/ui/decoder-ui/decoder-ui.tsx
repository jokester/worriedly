import React, { useEffect, useMemo, useState } from 'react';
import { PaperPage } from '../paper-page/paper-page';
import { DecoderSteps } from './decoder-steps';
import { ImagePicker } from './image-scanner';
import { Deferred } from '../../ts-commonutil/concurrency/deferred';
import { Result } from '@zxing/library';
import { Step1ImageScanner } from './step1-image-scanner';
import { getLogLevelLogger } from '../../ts-commonutil/logging/loglevel-logger';

const logger = getLogLevelLogger(__filename, 'DEBUG');

export const DecoderUI: React.FC = props => {
  const [step, setStep] = useState(1);

  const decoded = useMemo(() => new Deferred<Result>(), []);

  useEffect(() => {
    decoded.then(
      result => logger.info('result', result),
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
        <div>{step === 1 && <Step1ImageScanner onResult={decoded} />}</div>
      </PaperPage>
    </>
  );
};
