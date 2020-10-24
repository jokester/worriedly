import React, { useMemo, useRef, useState } from 'react';
import { useFileInput } from '../components/hooks/use-file-input';
import { paperGrids } from '../components/paper/paper-frame';
import { Button } from '@chakra-ui/core';
import { FAIcon } from '../components/font-awesome-icon';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { BrowserQRCodeReader, Result } from '@zxing/library';
import { useConcurrencyControl } from '@jokester/ts-commonutil/lib/react/hook/use-concurrency-control';
import { RecognizedFile } from '../../core/model/pipeline';
import { duplicateArrayBuffer, encodeArrayBufferToString } from '../../core/binary-conversion/conversion-es';
import jsSha1 from 'js-sha1';
import { either } from 'fp-ts';
import { readZxingResult } from '../../core/adapter/read-zxing-result';
import { pipe } from 'fp-ts/lib/function';
import { DecoderOptions } from './decoder-options';
import classNames from 'classnames';

function useCameraDecoder() {
  const decoded = useMemo(() => new Deferred<Result>(), []);
}

export const DecoderMain: React.FC = () => {
  const [recognizedFile, setRecognizedFile] = useState<null | RecognizedFile>();

  if (recognizedFile) {
    return <DecoderOptions recognized={recognizedFile} />;
  }

  return <QrRecognizer onRecognized={setRecognizedFile} />;
};

const QrRecognizer: React.FC<{ onRecognized?(o: RecognizedFile): void }> = (props) => {
  const [decodingCamera, setDecodingCamera] = useState(false);

  const [withLock, lockDepth] = useConcurrencyControl(1);

  const onStartDecodingFile = (f: File) =>
    withLock(async () => {
      const imgUrl = URL.createObjectURL(f);

      try {
        const decoder = new BrowserQRCodeReader();
        console.debug('decoded', imgUrl);
        const decoded = await decoder.decodeFromImageUrl(imgUrl);

        pipe(
          readZxingResult(decoded),
          either.fold(
            (l) => {
              alert(l);
            },
            (r) => {
              console.debug('decoded', decoded, r);
              const bytes = duplicateArrayBuffer(r.bytes);
              const sha1 = jsSha1(bytes);

              props.onRecognized?.({
                encoded: {
                  buffer: r.bytes,
                  sha1,
                  level: r.level,
                },
              });
            },
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

  return (
    <div className={classNames(paperGrids.resultCell, 'h-full')}>
      {fileInputElem}
      <div className="flex items-center justify-between p-8 mt-12">
        <Button onClick={fileOps.open} isDisabled={lockDepth > 0} isLoading={lockDepth > 0}>
          <FAIcon icon="file" className="mr-4" />
          From image file
        </Button>
        or
        <Button onClick={fileOps.open} isDisabled={lockDepth > 0} isLoading={lockDepth > 0}>
          <FAIcon icon="camera" className="mr-4" />
          From camera
        </Button>
      </div>
    </div>
  );
};
