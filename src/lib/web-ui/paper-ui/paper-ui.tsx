import React, { useState } from 'preact/compat';
import { FunctionComponent } from 'preact';

import './paper-ui.scss';
import { tailwindComponents } from './tailwind-components';
import { FilePicker } from './file-picker';
import { StepsIndicator } from './steps-indicator';

export const PaperUI: FunctionComponent = props => {
  const [step, setStep] = useState(1);
  const [bytes, setBytes] = useState<null | ArrayBuffer>(null);

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
        <FilePicker
          onSelected={arrayBuffer => {
            setBytes(arrayBuffer);
            setStep(2);
          }}
        />
      )}
      {step === 2 && 1}
    </div>
  );
};
