import React, { useState } from 'preact/compat';
import { FunctionComponent } from 'preact';
import classNames from 'classnames';

import './paper-ui.scss';
import { readBlobAsArrayBuffer } from '../../create-qr/encode-blob';
import { tailwindComponents } from './tailwind-components';

const StepsIndicator: FunctionComponent<{ step: number }> = ({ step }) => (
  <div className="steps-indicator">
    <ol>
      <li className={classNames('step', { current: step === 1, future: step < 1 })}>1. Select a file</li>
      <li className={classNames('step', { current: step === 2, future: step < 2 })}>2. Set options</li>
      <li className={classNames('step', { current: step === 3, future: step < 3 })}>3. Generate print-ready QR code</li>
    </ol>
  </div>
);

const FileSelector: FunctionComponent<{ onSelected(x: ArrayBuffer): void }> = props => {
  const [reading, setReading] = useState(false);
  const [bytes, setBytes] = useState<null | { filename: string; buffer: ArrayBuffer }>(null);

  const onFileRead = async (f: File | null | undefined) => {
    // FIXME: useLifecycle() to prevent hook leak
    if (f) {
      try {
        setReading(true);
        const read = await readBlobAsArrayBuffer(f);
        setBytes({ filename: f.name, buffer: read });
        setReading(false);
      } catch (e) {
        setReading(false);
      }
    }
  };

  return (
    <div className="step1">
      <div>
        <input
          id="file-picker"
          type="file"
          placeholder="XXX"
          disabled={reading}
          onChange={ev => {
            const target = ev && (ev.target as HTMLInputElement);
            onFileRead(target && target.files && target.files[0]);
          }}
        />
      </div>
      <div className="mt-2">
        <button
          className={tailwindComponents.button}
          disabled={reading || !bytes}
          onClick={() => bytes && props.onSelected(bytes.buffer)}
        >
          Proceed
        </button>
        {reading && <span className="monospace ml-2">Reading ...</span>}
        {!reading && bytes && (
          <span className="monospace ml-2">
            {bytes.filename} ({bytes.buffer.byteLength} bytes)
          </span>
        )}
      </div>
    </div>
  );
};

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
      {step === 1 && (
        <FileSelector
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
