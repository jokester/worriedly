import React, { useState } from 'preact/compat';
import { FunctionComponent } from 'preact';

import './paper-ui.scss';
import { tailwindComponents } from './tailwind-components';
import { Step1FilePicker } from './step1-file-picker';
import { StepsIndicator } from './steps-indicator';
import { InputData, QrOptions } from '../../core/types';
import { Step2OptionsPicker } from './step2-options-picker';
import { Step3PrintPreview } from './step3-print-preview';

export const PaperUI: FunctionComponent = props => {
  const [step, setStep] = useState(1);
  const [inputData, setInputData] = useState<null | InputData>(null);
  const [options, setOptions] = useState<null | QrOptions>(null);

  return (
    <div className="paper-ui">
      <div>
        <h1 className={tailwindComponents.appTitle}>Worriedly</h1>
        <a href="https://github.com/jokester/worriedly" target="_blank" rel="noreferrer noopener">
          github
        </a>
      </div>
      <hr />
      <StepsIndicator step={step} />

      <hr className="my-2" />

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
        />
      )}

      {step === 3 && inputData && options && <Step3PrintPreview inputData={inputData} options={options} />}
    </div>
  );
};
