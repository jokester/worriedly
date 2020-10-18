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

function useCameraDecoder() {
  const decoded = useMemo(() => new Deferred<Result>(), []);
}

export const DecoderMain: React.FC = () => {
  const [withLock, lockDepth] = useConcurrencyControl(1);

  const startC = useMemo(() => new Deferred<1>(), []);

  const [decodingFile, setDecodingFile] = useState<null | RecognizedFile>();

  const [decodingCamera, setDecodingCamera] = useState(false);

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

              setDecodingFile({
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

  if (decodingFile) {
    return <DecoderOptions recognized={decodingFile} />;
  }

  return (
    <div className={paperGrids.controlCell}>
      {fileInputElem}
      <div className="flex items-center justify-between p-8">
        <Button onClick={fileOps.open} isDisabled={lockDepth > 0}>
          <FAIcon icon="file" className="mr-4" />
          From image file
        </Button>
        or
        <Button onClick={fileOps.open} isDisabled={lockDepth > 0}>
          <FAIcon icon="camera" className="mr-4" />
          From camera
        </Button>
      </div>
    </div>
  );
};
