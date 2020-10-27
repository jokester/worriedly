import React, { useMemo, useRef, useState } from 'react';
import { useFileInput } from '../components/hooks/use-file-input';
import { paperGrids } from '../components/paper/paper-frame';
import { Button } from '@chakra-ui/core';
import { FAIcon } from '../components/font-awesome-icon';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { BrowserQRCodeReader, Result } from '@zxing/library';
import { useConcurrencyControl } from '@jokester/ts-commonutil/lib/react/hook/use-concurrency-control';
import { RecognizedFile } from '../../core/model/pipeline';
import { either } from 'fp-ts';
import { readZxingResult } from '../../core/adapter/read-zxing-result';
import { pipe } from 'fp-ts/lib/function';
import { DecoderOptions } from './decoder-options';
import classNames from 'classnames';
import useConstant from 'use-constant';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';

export const DecoderMain: React.FC = () => {
  const [recognizedFile, setRecognizedFile] = useState<null | RecognizedFile>();

  if (recognizedFile) {
    return <DecoderOptions recognized={recognizedFile} />;
  }

  return <QrRecognizer onRecognized={setRecognizedFile} />;
};

const QrRecognizer: React.FC<{ onRecognized?(o: RecognizedFile): void }> = (props) => {
  const reader = useConstant(() => new BrowserQRCodeReader());

  const [withLock, lockDepth] = useConcurrencyControl(1);

  const [readingCamera, setReadingCamera] = useState(false);
  const [devicesP, setDevices] = useState(() => reader.listVideoInputDevices());

  const devices = usePromised(devicesP);

  const onStartDecodingCamera = (device: MediaDeviceInfo) =>
    withLock(async () => {
      setReadingCamera(true);
      const completableFuture = new Deferred<Result>();

      try {
        await reader.decodeFromVideoDevice(device.deviceId, videoRef.current, (result, err) => {
          if (err) {
            completableFuture.reject(err);
          } else if (result) {
            completableFuture.fulfill(result);
          }
        });

        const decoded = await completableFuture;
        pipe(
          readZxingResult(decoded),
          either.fold(
            (l) => {
              alert(l);
            },
            (r) => props.onRecognized?.(r),
          ),
        );
      } catch (e) {
        alert('Error recognizing QR code: ' + String(e));
      } finally {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setReadingCamera(false);
      }
    });

  const onStartDecodingFile = (f: File) =>
    withLock(async () => {
      const imgUrl = URL.createObjectURL(f);

      try {
        console.debug('decoded', imgUrl);
        const decoded = await reader.decodeFromImageUrl(imgUrl);

        pipe(
          readZxingResult(decoded),
          either.fold(
            (l) => {
              alert(l);
            },
            (r) => props.onRecognized?.(r),
          ),
        );
      } catch (e) {
        alert(`Failed to decode QR code in file: ${e}`);
      } finally {
        URL.revokeObjectURL(imgUrl);
        fileOps.clear();
      }
    });

  const [fileInputElem, fileOps] = useFileInput(
    { onFile: onStartDecodingFile },
    { className: 'hidden', accept: 'image/*' },
  );

  const videoRef = useRef<HTMLVideoElement>(null!);

  return (
    <>
      <div className={classNames(paperGrids.controlCell, 'h-full')}>
        {fileInputElem}
        <div className="justify-between p-8 mt-12">
          <Button onClick={fileOps.open} isDisabled={lockDepth > 0} isLoading={lockDepth > 0} className="w-full">
            <FAIcon icon="file" className="mr-4" />
            From file
          </Button>

          {devices.fulfilled &&
            devices.value
              .filter((_) => _.kind === 'videoinput')
              .map((deviceInfo) => (
                <Button
                  onClick={() => onStartDecodingCamera(deviceInfo)}
                  isDisabled={lockDepth > 0}
                  isLoading={lockDepth > 0}
                  key={`${deviceInfo.deviceId} / ${deviceInfo.groupId}`}
                  className="mt-12 w-full"
                >
                  <FAIcon icon="camera" className="mr-4" />
                  From {deviceInfo.label}
                </Button>
              ))}
        </div>
      </div>
      <div className={classNames(paperGrids.resultCell, 'p-16', { hidden: !readingCamera })}>
        <video ref={videoRef} />
      </div>
    </>
  );
};
