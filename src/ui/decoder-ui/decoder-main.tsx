import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { TicToc } from '@jokester/ts-commonutil/lib/concurrency/tic-toc';
import { useMediaDevices, useUnmount, useUnmountPromise } from 'react-use';
import { usePageHidden, useUnmounted, useWhenMounted } from '../../utils/web/use-page-visibility';
import { stopVideo } from '../../utils/webrtc/read-stream';

export const DecoderMain: React.FC = () => {
  const [recognizedFile, setRecognizedFile] = useState<null | RecognizedFile>();

  if (recognizedFile) {
    return <DecoderOptions recognized={recognizedFile} />;
  }

  return <QrRecognizer onRecognized={setRecognizedFile} />;
};

const QrRecognizer: React.FC<{ onRecognized?(o: RecognizedFile): void }> = (props) => {
  const reader = useConstant(() => {
    return new BrowserQRCodeReader(1e3);
  });

  useEffect(() => {
    reader.timeBetweenDecodingAttempts = 0.5e3;
    return () => {
      stopVideo(videoRef.current);
    };
  }, []);

  const [withLock, lockDepth] = useConcurrencyControl(1);

  const [readingCamera, setReadingCamera] = useState<null | MediaDeviceInfo>(null);

  const devices$: { devices?: MediaDeviceInfo[] } = useMediaDevices();
  const devices = devices$.devices || [];

  const pageHidden = usePageHidden();
  const unmountPromise = useWhenMounted();
  const unmounted = useUnmounted();

  const onStartDecodingCamera = (device: MediaDeviceInfo) =>
    withLock(async () => {
      let errorMessage: string | undefined = undefined;
      setReadingCamera(device);

      const tic = new TicToc();
      const completableFuture = new Deferred<Result>();

      try {
        reader.decodeFromVideoDevice(device.deviceId, videoRef.current, (result, err) => {
          console.debug('continuous decode', result, err, tic.toc());
          if (pageHidden.current) {
            completableFuture.reject('Page went background. Stopping.');
          } else if (result) {
            completableFuture.fulfill(result);
          } else if (err && tic.toc() > 10e3) {
            completableFuture.reject(err);
          } else if (tic.toc() > 10e3) {
            completableFuture.reject('Timeout');
          }
        });

        const decoded = await unmountPromise(Promise.race([completableFuture, unmounted]));
        console.debug('decoded', decoded);

        if (decoded) {
          pipe(
            readZxingResult(decoded),
            either.fold(
              (l) => {
                alert(l);
              },
              (r) => props.onRecognized?.(r),
            ),
          );
        }
      } catch (e) {
        errorMessage = 'Error recognizing QR code: ' + String(e);
      } finally {
        reader.stopContinuousDecode();
        stopVideo(videoRef.current);
        setReadingCamera(null);
      }

      if (errorMessage) {
        alert(errorMessage);
      }
    });

  const onStartDecodingFile = (f: File) =>
    withLock(async () => {
      const imgUrl = URL.createObjectURL(f);

      try {
        console.debug('decoded', imgUrl);
        const decoded = await unmountPromise(reader.decodeFromImageUrl(imgUrl));

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
    <div className={classNames(paperGrids.allCells, 'h-full')}>
      {fileInputElem}

      <div className={classNames(paperGrids.resultCell, 'p-16', { hidden: !readingCamera })}>
        <video ref={videoRef} />
      </div>
      <div className={classNames('justify-between p-8 mt-12', { hidden: readingCamera })}>
        <Button onClick={fileOps.open} isDisabled={lockDepth > 0} isLoading={lockDepth > 0} className="w-full">
          <FAIcon icon="file" className="mr-4" />
          From file
        </Button>

        {devices
          .filter((_) => _.kind === 'videoinput')
          .map((deviceInfo, cameraIndex) => (
            <Button
              onClick={() => onStartDecodingCamera(deviceInfo)}
              isDisabled={lockDepth > 0}
              isLoading={lockDepth > 0}
              key={`${deviceInfo.deviceId} / ${deviceInfo.groupId}`}
              className="mt-12 w-full h-16"
            >
              <DevicePreview deviceInfo={deviceInfo} deviceIndex={cameraIndex} />
            </Button>
          ))}
      </div>
    </div>
  );
};

const DevicePreview: React.FC<{ deviceInfo: MediaDeviceInfo; deviceIndex: number }> = ({ deviceInfo, deviceIndex }) => {
  if (deviceInfo.label) {
    return (
      <>
        <FAIcon icon="camera" className="mr-4" />
        Scan with
        <br className="my-1" />
        {`${deviceInfo.label}`}
      </>
    );
  }

  if (deviceInfo.deviceId && 0) {
    return (
      <>
        <FAIcon icon="camera" className="mr-4" />
        Scan with
        <br className="my-1" />
        {`(id: ${deviceInfo.deviceId})`}
      </>
    );
  }

  return (
    <>
      <FAIcon icon="camera" className="mr-4" />
      Scan with Camera #{1 + deviceIndex}
    </>
  );
};
