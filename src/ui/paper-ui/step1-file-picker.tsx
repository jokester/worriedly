import { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { readBlobAsArrayBuffer } from '../../core/encode-blob';
import { tailwindComponents } from './tailwind-components';
import { InputData } from '../../core/types';

export const Step1FilePicker: FunctionComponent<{
  onSelected(x: InputData): void;
}> = props => {
  const [reading, setReading] = useState(false);
  const [inputData, setInputData] = useState<null | InputData>(null);

  const onFileRead = async (f: File | null | undefined) => {
    // FIXME: useLifecycle() to prevent hook leak
    if (f) {
      try {
        setReading(true);
        const read = await readBlobAsArrayBuffer(f);
        setInputData({ filename: f.name, inputBuffer: read });
        setReading(false);
      } catch (e) {
        alert(String(e));
        setReading(false);
      }
    }
  };

  return (
    <>
      <div className="step-content step1">
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>File</label>
          <input
            id="file-picker"
            type="file"
            placeholder="XXX"
            disabled={reading}
            className={tailwindComponents.formInput}
            onChange={ev => {
              const target = ev && (ev.target as HTMLInputElement);
              onFileRead(target && target.files && target.files[0]);
            }}
          />
        </div>
        <div>
          {reading && <span className="monospace ml-2">Reading ...</span>}
          {!reading && inputData && (
            <span className="monospace ml-2">
              {inputData.filename} ({inputData.inputBuffer.byteLength} bytes)
            </span>
          )}
        </div>
      </div>
      <hr />
      <div className={tailwindComponents.buttonBar}>
        <button
          className={reading || !inputData ? tailwindComponents.buttonDisabled : tailwindComponents.button}
          disabled={reading || !inputData}
          onClick={() => inputData && props.onSelected(inputData)}
        >
          Proceed
        </button>
      </div>
    </>
  );
};
