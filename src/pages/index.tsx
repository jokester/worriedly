import React, { FC, useState } from 'react';
import { LayoutRoot } from '../ui/layout/layout-root';
import { AppBanner } from '../ui/components/app-banner';
import { ModeSelector } from '../ui/mode-selector';
import { PaperFrame, paperGrids } from '../ui/components/paper/paper-frame';
import classNames from 'classnames';
import { EncoderMain } from '../ui/encoder-ui/encoder-ui';
import { DecoderMain } from '../ui/decoder-ui/decoder-main';
import { DecoderMultipleDemo } from '../ui/decoder-ui/decoder-multiple-demo';

export const IndexPage: FC = () => {
  const [encodeFile, setEncodeFile] = useState<null | File>(null);
  const [decoding, setDecoding] = useState(false);
  const onRestart = () => {
    setEncodeFile(null);
    setDecoding(false);
  };

  return (
    <LayoutRoot>
      <AppBanner onRestart={onRestart} showRestart={!!(encodeFile || decoding)} />
      <PaperFrame className="mx-auto ">
        {null && encodeFile === null && !decoding && (
          <div className={classNames(paperGrids.allCells, 'flex items-center justify-center')}>
            <ModeSelector onStartEncode={setEncodeFile} onStartDecode={() => setDecoding(true)} />
          </div>
        )}
        {null && encodeFile && <EncoderMain inputFile={encodeFile} />}
        {null && decoding && <DecoderMain />}
        {<DecoderMultipleDemo />}
      </PaperFrame>
    </LayoutRoot>
  );
};
