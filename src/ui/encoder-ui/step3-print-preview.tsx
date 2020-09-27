import { FunctionComponent } from 'react';
import { RawFile, QrOptions } from '../../core/model/types';
import React, { useMemo } from 'react';
import { createQR } from '../../core/qr/create-qr';
import { tailwindComponents } from '../tailwind-components';
import { createAspectRatioStyle } from '../aspect-ratio/aspect-ratio';

export const Step3PrintPreview: FunctionComponent<{ inputData: RawFile; options: QrOptions }> = props => {
  const encodedQr = useMemo(() => createQR(props.options.filteredBytes, props.options.errorCorrectionLevel), [
    props.options.filteredBytes,
    props.options.errorCorrectionLevel,
  ]);
  return (
    <div className="step3 step-container print-page flex flex-col w-full h-full p-4">
      <div className="meta-container text-sm flex-1 flex flex-col justify-center">
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Created at</label>
          <span className={tailwindComponents.formInput}>{new Date().toISOString()}</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Raw filename</label>
          <span className={tailwindComponents.formInput}>{props.inputData.filename}</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Raw size</label>
          <span className={tailwindComponents.formInput}>{props.inputData.inputBuffer.byteLength} bytes</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Raw content type</label>
          <span className={tailwindComponents.formInput}>{props.inputData.contentType || 'unknown'}</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Raw SHA1</label>
          <span className={tailwindComponents.formInput}>{props.inputData.sha1}</span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Encodings</label>
          <span className={tailwindComponents.formInput}>{props.options.filters.join('|')} </span>
        </div>
        <div className={tailwindComponents.formLine}>
          <label className={tailwindComponents.formLabel}>Encoded size</label>
          <span className={tailwindComponents.formInput}>{props.options.filteredBytes.length} bytes</span>
        </div>
      </div>
      <hr />
      <div className="qr-container" style={createAspectRatioStyle(1)}>
        <img className="qr-img" src={encodedQr.gifDataUri} alt="encoded-qr-img" />
      </div>
    </div>
  );
};
