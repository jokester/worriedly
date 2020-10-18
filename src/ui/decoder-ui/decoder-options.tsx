import { RecognizedFile, TransformPreset } from '../../core/model/pipeline';
import { paperGrids } from '../components/paper/paper-frame';
import React, { useState } from 'react';

export const DecoderOptions: React.FC<{ recognized: RecognizedFile }> = (props) => {
  const [decodePreset, setDecodePreset] = useState<null | TransformPreset>(null)
  return <div className={paperGrids.allCells}>


  </div>;
};
