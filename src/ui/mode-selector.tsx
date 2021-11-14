import { Button } from '@chakra-ui/react';
import React from 'react';
import { useFileInput } from './components/hooks/use-file-input';

export const ModeSelector: React.FC<{ onStartEncode?(file: File): void; onStartDecode?(): void }> = (props) => {
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
