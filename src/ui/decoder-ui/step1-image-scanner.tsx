import React, { useMemo, useRef, useState } from 'react';
import { BrowserQRCodeReader, Result } from '@zxing/library';
import { usePromised } from '../../ts-commonutil/react/hook/use-promised';
import { Deferred } from '../../ts-commonutil/concurrency/deferred';
import { tailwindComponents } from '../tailwind-components';
import classNames from 'classnames';

function enumerateDevices(reader: BrowserQRCodeReader) {
  if (!reader.canEnumerateDevices) throw 'cannot';
  return reader.listVideoInputDevices();
}

function start(tgt: HTMLVideoElement, device: MediaDeviceInfo) {}

async function startScanAndWaitForResult(
  reader: BrowserQRCodeReader,
  deviceId: string,
  videoElem: HTMLVideoElement,
): Promise<Result> {
  return new Promise<Result>((fulfill, reject) => {
    reader.decodeFromVideoDevice(deviceId, videoElem, (result, error) => {
      if (error) reject(error);
      else fulfill(result);
    });
  });
}

export const Step1ImageScanner: React.FC<{ onResult: Deferred<Result> }> = props => {
  const codeReader = useMemo(() => new BrowserQRCodeReader(), []);
  const devicesP = useMemo(() => enumerateDevices(codeReader), [codeReader]);
  const devices = usePromised(devicesP);

  const videoRef = useRef<HTMLVideoElement>(null!);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const [inited, setInited] = useState(false);

  const onDeviceSelected = async (deviceId: string) => {
    const dev = await startScanAndWaitForResult(codeReader, deviceId, videoRef.current);
    props.onResult.fulfill(dev);
  };

  const onImageSelected = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const scanned = await codeReader.decodeFromImageUrl(url);
    props.onResult.fulfill(scanned);
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files && ev.target.files[0]) {
      onImageSelected(ev.target.files[0]);
    }
  };

  return (
    <div>
      <video ref={videoRef} />
      <div>
        <input type="file" accept="image/*" onChange={onChange} hidden ref={fileInputRef} />
        <button onClick={() => fileInputRef.current.click()} className={classNames(tailwindComponents.button(false))}>
          select photo
        </button>
        {devices.fulfilled &&
          devices.value.map((deviceInfo, i) => (
            <button
              key={i}
              onClick={() => onDeviceSelected(deviceInfo.deviceId)}
              className={classNames('ml-2', tailwindComponents.button(false))}
            >
              use {deviceInfo.label}
            </button>
          ))}
      </div>
      <div>{devices.rejected && String(devices.reason)}</div>
    </div>
  );
};
