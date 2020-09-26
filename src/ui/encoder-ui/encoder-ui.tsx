import React, { useMemo, useState } from 'react';

import './encoder-ui.scss';
import { Step1FilePicker } from './step1-file-picker';
import { EncoderSteps } from './encoder-steps';
import { InputData, QrOptions } from '../../core/types';
import { Step2OptionsPicker } from './step2-options-picker';
import { Step3PrintPreview } from './step3-print-preview';
import { PipelineState } from '../../core/model/pipe-spec';
import { Never } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { StepArrow, StepContainer, StepContent, StepDesc } from '../components/step-container';
import { FilePicker } from '../components/file-picker';
import { readBlobAsArrayBuffer } from '../../core/web/encode-blob';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import jsSha1 from 'js-sha1';

const logger = getLogLevelLogger('encoder-ui', 'debug');

export const EncoderUI2: React.FC = (props) => {
  const [inputFile, setInputFile] = useState<null | File>(null);

  const inputDataP = useMemo<Promise<InputData>>(async (): Promise<InputData> => {
    if (!inputFile) return Never;

    const f = inputFile;
    const read = await readBlobAsArrayBuffer(f);
    return { filename: f.name, inputBuffer: read, contentType: f.type, sha1: jsSha1(read) };
  }, [inputFile]);
  const inputData = usePromised(inputDataP);

  const [options, setOptions] = useState<null | QrOptions>(null);

  const [encodedP, setEncodedP] = useState<Promise<PipelineState>>(Never);

  const encoded = usePromised(encodedP);

  logger.debug('EncoderUI2', inputFile, inputData, options);

  return (
    <div>
      <StepContainer>
        <StepDesc>1. Pick a file</StepDesc>
        <StepContent>
          <FilePicker onFile={setInputFile} />
        </StepContent>
      </StepContainer>
      <StepArrow />
      <StepContainer>
        <StepDesc>2. Preview</StepDesc>
        <StepContent></StepContent>
      </StepContainer>
      <StepArrow />
      <StepContainer>
        <StepDesc>3. Print</StepDesc>
        <StepContent>TODO</StepContent>
      </StepContainer>
    </div>
  );
};

export const EncoderUi: React.FC = (props) => {
  const [step, setStep] = useState(1);
  const [inputData, setInputData] = useState<null | InputData>(null);
  const [options, setOptions] = useState<null | QrOptions>(null);

  return (
    <>
      <hr className="mb-2" />
      <div className="unprintable">
        <EncoderSteps step={step} />
      </div>
      <div className="h-full w-full encoder-ui flex-col">
        {step === 1 && (
          <Step1FilePicker
            onSelected={(input) => {
              setInputData(input);
              setStep(2);
            }}
          />
        )}

        {step === 2 && inputData && (
          <Step2OptionsPicker
            inputData={inputData}
            onOptionsSet={(o) => {
              setStep(3);
              setOptions(o);
            }}
            onBack={() => {
              setOptions(null);
              setStep(1);
            }}
          />
        )}

        {step === 3 && inputData && options && <Step3PrintPreview inputData={inputData} options={options} />}
      </div>
    </>
  );
};
