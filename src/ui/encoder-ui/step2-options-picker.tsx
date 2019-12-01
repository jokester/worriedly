import { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { DataFilters, InputData, QrOptions } from '../../core/types';
import { encodeArrayBufferToString } from '../../core/encode-blob';
import { CorrectionLevels, maxNumOfBytes } from '../../core/create-qr';
import { tailwindComponents } from '../tailwind-components';

export const Step2OptionsPicker: FunctionComponent<{
  inputData: InputData;
  onOptionsSet?(options: QrOptions): void;
  onBack?(): void;
}> = props => {
  const [errorCorrectionLevel, setCorrectionLevel] = useState<CorrectionLevels>('H');

  const maxFilteredLength = useMemo(() => maxNumOfBytes(errorCorrectionLevel), [errorCorrectionLevel]);

  const [encoded, setEncoded] = useState<{ length: number; bytes: string }>(() => {
    const encoded = encodeArrayBufferToString(props.inputData.inputBuffer);

    return {
      length: encoded.length,
      bytes: encoded,
    };
  });

  const errorMsg = [
    encoded.length > maxFilteredLength && 'Exceeds capacity of QR code at current correction level',
  ] as const;

  const canProceed = !errorMsg.some(_ => _);

  return (
    <>
      <div className="form-content step2">
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Raw filename</label>
          <span className={tailwindComponents.formInput}>{props.inputData.filename}</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Raw size</label>
          <span className={tailwindComponents.formInput}>{props.inputData.inputBuffer.byteLength} bytes</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Correction Level</label>
          <select
            className={tailwindComponents.formInput}
            value={errorCorrectionLevel}
            onChange={ev => setCorrectionLevel((ev.target as HTMLSelectElement).value as CorrectionLevels)}
          >
            <option value="H">H (up to {maxNumOfBytes('H')} bytes)</option>
            <option value="Q">Q (up to {maxNumOfBytes('Q')} bytes)</option>
            <option value="M">M (up to {maxNumOfBytes('M')} bytes)</option>
            <option value="L">L (up to {maxNumOfBytes('L')} bytes)</option>
          </select>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Encodings</label>
          <span className={tailwindComponents.formInput}>none</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Encoded size</label>
          <span className={tailwindComponents.formInput}>{encoded.length} bytes</span>
        </div>
      </div>
      <hr />
      <div className={tailwindComponents.buttonBar}>
        <button className={tailwindComponents.button(false)} onClick={() => props.onBack && props.onBack()}>
          Back
        </button>
        <button
          className={tailwindComponents.button(!canProceed)}
          disabled={!canProceed}
          onClick={() => {
            props.onOptionsSet &&
              props.onOptionsSet({
                errorCorrectionLevel,
                filteredBytes: encoded.bytes,
                filters: [DataFilters.none],
              });
          }}
        >
          Proceed
        </button>
      </div>
      <ul className={tailwindComponents.errorMessage}>
        {errorMsg
          .filter(_ => _)
          .map((text, i) => (
            <li key={i}>{text}</li>
          ))}
      </ul>
    </>
  );
};
