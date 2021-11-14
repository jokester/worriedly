import React, { FC, useState } from 'react';
import { LayoutRoot } from '../src/ui/layout/layout-root';
import { AppBanner } from '../src/ui/components/app-banner';
import { ModeSelector } from '../src/ui/mode-selector';
import { PaperFrame, paperGrids } from '../src/ui/components/paper/paper-frame';
import classNames from 'classnames';
import { EncoderMain } from '../src/ui/encoder-ui/encoder-ui';
import { DecoderMain } from '../src/ui/decoder-ui/decoder-main';

const IndexPage: FC = () => {
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
        {encodeFile === null && !decoding && (
          <div className={classNames(paperGrids.allCells, 'flex items-center justify-center')}>
            <ModeSelector onStartEncode={setEncodeFile} onStartDecode={() => setDecoding(true)} />
          </div>
        )}
        {encodeFile && <EncoderMain inputFile={encodeFile} />}
        {decoding && <DecoderMain />}
      </PaperFrame>
    </LayoutRoot>
  );
};

export default IndexPage;
