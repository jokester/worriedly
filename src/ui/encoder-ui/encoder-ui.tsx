import React, { useState } from 'react';
import { FunctionComponent } from 'react';

import './encoder-ui.scss';
import { Step1FilePicker } from './step1-file-picker';
import { StepsIndicator } from './steps-indicator';
import { InputData, QrOptions } from '../../core/types';
import { Step2OptionsPicker } from './step2-options-picker';
import { Step3PrintPreview } from './step3-print-preview';
import { PaperPage } from '../paper-page/paper-page';

export const EncoderUi: FunctionComponent = props => {
  const [step, setStep] = useState(1);
  const [inputData, setInputData] = useState<null | InputData>(null);
  const [options, setOptions] = useState<null | QrOptions>(null);

  return (
    <>
      <hr className="mb-2" />
      <div className="unprintable">
        <StepsIndicator step={step} />
      </div>
      <PaperPage>
        <div className="h-full w-full encoder-ui flex-col">
          {step === 1 && (
            <Step1FilePicker
              onSelected={input => {
                setInputData(input);
                setStep(2);
              }}
            />
          )}

          {step === 2 && inputData && (
            <Step2OptionsPicker
              inputData={inputData}
              onOptionsSet={o => {
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
      </PaperPage>
    </>
  );
};
