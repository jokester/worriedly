import { useState } from 'react';
import { Button } from '@chakra-ui/core';
import React from 'react';
import { AppBanner } from './components/app-banner';
import { EncoderUi } from './encoder-ui/encoder-ui';

const ModeSelector: React.FC<{ onStartEncode?(): void; onStartDecode?(): void }> = (props) => {
  return (
    <div className="p-4 space-y-4">
      <Button onClick={() => props.onStartEncode?.()} className="block w-full">
        Save to paper
      </Button>
      <Button onClick={() => props.onStartDecode?.()} className="block w-full">
        Restore from paper
      </Button>
    </div>
  );
};

export const Main: React.FC = () => {
  const [mode, setMode] = useState<null | 'decode' | 'encode'>(null);

  return (
    <div>
      <AppBanner onRestart={() => setMode(null)} showRestart={mode !== null} />
      <hr />
      {mode === null && (
        <ModeSelector onStartEncode={() => setMode('encode')} onStartDecode={() => setMode('decode')} />
      )}
      {mode === 'encode' && <EncoderUi />}
      {mode === 'decode' && null}
    </div>
  );
};
