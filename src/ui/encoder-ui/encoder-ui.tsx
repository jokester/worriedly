import React, { useMemo, useState } from 'react';

import style from './encoder-ui.module.scss';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { getLogLevelLogger } from '@jokester/ts-commonutil/lib/logging/loglevel-logger';
import jsSha1 from 'js-sha1';
import { binaryConversion } from '../../core/binary-conversion';
import { RawFile, RenderedFile } from '../../core/model/pipeline';
import { Button, FormControl, FormLabel, Input, Radio, RadioGroup } from '@chakra-ui/core';
import { either } from 'fp-ts';
import { paperGrids } from '../components/paper/paper-frame';
import classNames from 'classnames';
import { correctionLevels, encoderPresets } from './encoder-options';
import { useClippedIndex } from '../components/hooks/use-clipped';
import { FAIcon } from '../components/font-awesome-icon';
import { encodeFile } from '../../core/model/encode-pipeline';
import { createQR } from '../../core/model/render-pipeline';
import { pipe } from 'fp-ts/lib/function';

const logger = getLogLevelLogger('encoder-ui', 'debug');

export const EncoderMain: React.FC<{ inputFile: File }> = (props) => {
  const { inputFile } = props;

  const inputReadP = useMemo(async () => {
    const read = await binaryConversion.blob.toArrayBuffer(inputFile);
    return {
      filename: inputFile.name,
      contentType: inputFile.type,
      raw: {
        inputBuffer: read,
        sha1: jsSha1(read),
      },
    } as const;
  }, [inputFile]);

  const inputRead = usePromised(inputReadP);

  const [presetIndex, setPresetIndex] = useClippedIndex(encoderPresets);
  const [levelIndex, setLevelIndex] = useClippedIndex(correctionLevels);

  const preset = encoderPresets[presetIndex];
  const level = correctionLevels[levelIndex];

  const encodedP = useMemo(
    () =>
      inputReadP.then((read) =>
        encodeFile(
          {
            ...read,
            encodePreset: preset,
          },
          preset,
          level.name,
        ),
      ),
    [inputRead, preset, level],
  );
  const encoded = usePromised(encodedP);

  const [rendered, setRendered] = useState<null | RenderedFile>(null);

  logger.debug('inputRead', inputRead);
  logger.debug('encoded', encoded);

  if (rendered) {
    return <RendererView rendition={rendered} />;
  }

  return (
    <div className={classNames(paperGrids.allCells, 'px-4')}>
      <h2 className="py-6 text-xl text-center">
        <FAIcon icon="cog" className="mr-2" />
        Settings
      </h2>
      <div className="flex ">
        <FormControl className="w-1/2">
          <FormLabel className="text-sm">Encode Preset </FormLabel>
          <RadioGroup value={presetIndex} onChange={(ev) => setPresetIndex(Number(ev.target.value))}>
            {encoderPresets.map((preset, i) => (
              <Radio key={i} value={i} size="sm">
                {preset.name}
              </Radio>
            ))}
          </RadioGroup>
        </FormControl>

        <FormControl className="w-1/2">
          <FormLabel className="text-sm">QR Code Correlation Level</FormLabel>
          <RadioGroup value={levelIndex} onChange={(ev) => setLevelIndex(Number(ev.target.value))}>
            {correctionLevels.map((l, i) => (
              <Radio key={i} value={i} size="sm">
                {l.desc}
              </Radio>
            ))}
          </RadioGroup>
        </FormControl>
      </div>
      <hr className="mt-6" />

      <div>
        <h2 className="py-6 text-xl text-center">
          <FAIcon icon="file" className="mr-2" />
          Preview
        </h2>
        <FormControl>
          <FormLabel className="text-sm">Filename</FormLabel>
          <Input size="sm" value={inputFile.name} isReadOnly />
          <FormLabel className="text-sm">Content Type</FormLabel>
          <Input size="sm" value={inputFile.type} isReadOnly />
          <FormLabel className="text-sm">Original Size</FormLabel>
          <Input size="sm" value={`${inputFile.size.toLocaleString()} bytes`} isReadOnly />
          <FormLabel className="text-sm">Original SHA1</FormLabel>
          <Input size="sm" value={(inputRead.fulfilled && inputRead.value.raw.sha1) || 'computing...'} isReadOnly />
        </FormControl>
      </div>
      <hr className="my-6" />
      <div>
        {encoded.pending && (
          <div className="text-center">
            <Button isFullWidth isLoading variantColor="blue">
              Continue
            </Button>
          </div>
        )}

        {encoded.fulfilled && (
          <div>
            {pipe(
              encoded.value,

              either.fold(
                (l) => (
                  <>
                    <Button isFullWidth isDisabled variant="solid">
                      Continue
                    </Button>
                    <p className="mt-4 text-red-600">Error: {l}</p>
                  </>
                ),
                (r) => (
                  <Button isFullWidth variant="solid" onClick={() => setRendered(createQR(r, level.name))}>
                    Continue
                  </Button>
                ),
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RendererView: React.FC<{ rendition: RenderedFile }> = (props) => {
  const { rendered, filename, contentType, raw, encoded, encodePreset } = props.rendition;
  return (
    <>
      <div className={classNames(paperGrids.controlCell, 'p-12')}>
        <FormControl>
          <FormLabel className="text-sm">Filename</FormLabel>
          <Input size="sm" value={filename} isReadOnly />
          <FormLabel className="text-sm">Content Type</FormLabel>
          <Input size="sm" value={contentType} isReadOnly />
          <FormLabel className="text-sm">Size</FormLabel>
          <Input size="sm" value={`${raw.inputBuffer.byteLength.toLocaleString()} bytes`} isReadOnly />
          <FormLabel className="text-sm">SHA1</FormLabel>
          <Input size="sm" value={raw.sha1} isReadOnly />
        </FormControl>
      </div>
      <div className={classNames(paperGrids.resultCell, 'p-8')}>
        <img className={style.renderedQrImage} src={rendered.gifDataUri} alt="encoded-qr-img" />
      </div>
    </>
  );
};
