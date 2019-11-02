import React, { useMemo } from 'preact/compat';
import { FunctionalComponent } from 'preact';
import { createQRFromBytes } from '../create-qr/create-qr';
import { QrEncodedFile } from './qr-meta';
import './print-qr.scss';

interface PrintPageProps {
  encoded: QrEncodedFile;
}

export const PagePreview: FunctionalComponent<PrintPageProps> = ({ encoded }) => {
  const createdQr = useMemo(() => createQRFromBytes(encoded.encodedBytes, 'L'), [encoded.encodedBytes]);
  return (
    <div className="fullpage">
      <div className="preview-paper">
        <h1>title</h1>
        <img className="qr-image" src={createdQr.gifDataUri} />
      </div>
    </div>
  );
};
