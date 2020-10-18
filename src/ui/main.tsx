import { useState } from 'react';
import { Button } from '@chakra-ui/core';
import React from 'react';
import { EncoderMain } from './encoder-ui/encoder-ui';
import { PaperFrame, paperGrids } from './components/paper/paper-frame';
import classNames from 'classnames';
import { useFileInput } from './components/hooks/use-file-input';
import { DecoderMain } from './decoder-ui/decoder-main';

const ModeSelector: React.FC<{ onStartEncode?(file: File): void; onStartDecode?(): void }> = (props) => {
  const [inputElem, inputOps] = useFileInput(
    {
      onFile: props.onStartEncode,
    },
    { className: 'hidden' },
  );
  return (
    <div className="px-8">
      {inputElem}
      <Button onClick={inputOps.open} className="w-full">
        I have a file
      </Button>
      <Button onClick={() => props.onStartDecode?.()} className="w-full mt-16">
        I have a printed QR code
      </Button>
    </div>
  );
};

export const Main: React.FC = () => {
  const [encodeFile, setEncodeFile] = useState<null | File>(null);
  const [decoding, setDecoding] = useState(false);

  return (
    <PaperFrame className="mx-auto ">
      {encodeFile === null && !decoding && (
        <div className={classNames(paperGrids.allCells, 'flex items-center justify-center')}>
          <ModeSelector onStartEncode={setEncodeFile} onStartDecode={() => setDecoding(true)} />
        </div>
      )}
      {encodeFile && <EncoderMain inputFile={encodeFile} />}
      {decoding && <DecoderMain />}
    </PaperFrame>
  );
};
