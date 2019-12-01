import React, { useEffect, useState } from 'preact/compat';
import { FunctionalComponent } from 'preact';
import { PagePreview } from './page-preview';
import { encodeBlobToString, readBlobAsArrayBuffer } from '../create-qr/encode-blob';
import { maxNumOfBytes, throwIfLengthExceeded } from '../create-qr/create-qr';
import { QrEncodedFile } from './qr-meta';

export const PrintQr: FunctionalComponent = props => {
  const [file, setFile] = useState<null | File>(null);

  const [encoded, setEncoded] = useState<null | QrEncodedFile>(null);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) return;

    let disposed = false;

    try {
      console.log('file', file);
      throwIfLengthExceeded('H', file.size);
    } catch (e) {
      setError(String(e));
      return;
    }

    encodeBlobToString(file).then(
      encodedBytes =>
        disposed ||
        setEncoded({
          filename: file.name,
          numBytes: file.size,
          encodedBytes,
          contentType: file.type,
          file,
        }),
      err => disposed || setError(String(err)),
    );

    return () => {
      disposed = true;
    };
  }, [file]);

  const reset = () => {
    setFile(null);
    setError('');
  };

  console.log('rendering', file, error);

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={reset}>reset</button>
      </div>
    );
  } else if (!file) {
    return (
      <input
        type="file"
        onChange={ev => {
          const files = ev.target && (ev.target as HTMLInputElement).files;
          if (files && files.length) {
            setFile(files[0] || null);
          }
        }}
      />
    );
  } else if (encoded) {
    return <PagePreview encoded={encoded} />;
  } else {
    return <p>loading ...</p>;
  }
};
