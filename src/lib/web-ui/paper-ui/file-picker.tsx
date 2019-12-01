import { FunctionComponent } from 'preact';
import React, { useState } from 'preact/compat';
import { readBlobAsArrayBuffer } from '../../create-qr/encode-blob';
import { tailwindComponents } from './tailwind-components';

export const FilePicker: FunctionComponent<{ onSelected(x: ArrayBuffer): void }> = props => {
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
