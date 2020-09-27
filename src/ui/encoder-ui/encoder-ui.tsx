import React, { useMemo, useState } from 'react';

import './encoder-ui.scss';
import { QrOptions } from '../../core/model/typed-deprecated';
import { Never } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { StepArrow, StepContainer, StepContent, StepDesc } from '../components/step-container';
import { FilePicker } from '../components/file-picker';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import jsSha1 from 'js-sha1';
import { binaryConversion } from '../../core/binary-conversion';
import { EncodedQr, RawFile } from '../../core/model/pipeline';
import { EncoderOptions } from './encoder-options';

const logger = getLogLevelLogger('encoder-ui', 'debug');

export const EncoderMain: React.FC = (props) => {
  const [inputFile, setInputFile] = useState<null | File>(null);

  const inputDataP = useMemo<Promise<RawFile>>(async (): Promise<RawFile> => {
    if (!inputFile) return Never;

    const f = inputFile;
    const read = await binaryConversion.blob.toArrayBuffer(f);
    return { filename: f.name, inputBuffer: read, contentType: f.type, sha1: jsSha1(read) };
  }, [inputFile]);
  const inputData = usePromised(inputDataP);

  const [options, setOptions] = useState<null | QrOptions>(null);

  const [encodedP, setEncodedP] = useState<Promise<EncodedQr>>(Never);

  const encoded = usePromised(encodedP);

  logger.debug('EncoderUI2', inputFile, inputData, options);

  return (
    <div>
      <StepContainer>
        <StepDesc>1. Pick a file</StepDesc>
        <StepContent>
          <FilePicker onFile={setInputFile} />
        </StepContent>
      </StepContainer>
      <StepArrow />
      <StepContainer>
        <StepDesc>2. Preview</StepDesc>
        <StepContent>{inputData.fulfilled && <EncoderOptions input={inputData.value} />}</StepContent>
      </StepContainer>
      <StepArrow />
      <StepContainer>
        <StepDesc>3. Print</StepDesc>
        <StepContent>TODO</StepContent>
      </StepContainer>
    </div>
  );
};
