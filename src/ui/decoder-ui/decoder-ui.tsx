import React, { useMemo, useState } from 'react';
import { PaperPage } from '../paper-page/paper-page';
import { DecoderSteps } from './decoder-steps';
import { ImagePicker } from './image-scanner';

export const DecoderUI: React.FC = props => {
  const [step, setStep] = useState(1);
  const [imageBlob, setImageBlob] = useState<null | Blob>();
  const imgUrl = useMemo(() => (imageBlob ? URL.createObjectURL(imageBlob) : null), [imageBlob]);

  return (
    <>
      <hr className="mb-2" />
      <div className="unprintable">
        <DecoderSteps step={step} />
      </div>
      <PaperPage>
        <div>
          {step === 1 && (
            <ImagePicker
              onImage={blob => {
                setImageBlob(blob);
                setStep(2);
              }}
            />
          )}
          {step === 2 && imgUrl && <img src={imgUrl} />}
        </div>
      </PaperPage>
    </>
  );
};
