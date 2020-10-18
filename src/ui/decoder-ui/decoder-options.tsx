import { DecodedFile, RecognizedFile } from '../../core/model/pipeline';
import { paperGrids } from '../components/paper/paper-frame';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { decodeFile } from '../../core/model/decode-pipeline';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { Button, FormControl, FormLabel, Input, Radio, RadioGroup } from '@chakra-ui/core';
import { decodePresets } from '../../core/model/decode-options';
import classNames from 'classnames';
import { useClippedIndex } from '../components/hooks/use-clipped';
import { FAIcon } from '../components/font-awesome-icon';
import { pipe } from 'fp-ts/pipeable';
import { either } from 'fp-ts';
import { useHiddenAnchor } from '../components/hooks/use-file-input';

export const DecoderOptions: React.FC<{ recognized: RecognizedFile }> = (props) => {
  const [presetIndex, setPresetIndex] = useClippedIndex(decodePresets);

  const decodedP = useMemo(() => decodeFile(props.recognized, decodePresets[presetIndex]), []);

  const decoded = usePromised(decodedP);

  console.log('decoded', decoded);

  return (
    <>
      <div className={classNames(paperGrids.allCells, 'p-8')}>
        <h2 className="pb-6 text-xl text-center">
          <FAIcon icon="cog" className="mr-2" />
          Settings
        </h2>
        <FormControl className="w-1/2">
          <FormLabel className="text-sm">Encode Preset </FormLabel>
          <RadioGroup value={presetIndex} onChange={(ev) => setPresetIndex(Number(ev.target.value))}>
            {decodePresets.map((preset, i) => (
              <Radio key={i} value={i} size="sm">
                {preset.name}
              </Radio>
            ))}
          </RadioGroup>
        </FormControl>
      </div>

      <div className={classNames(paperGrids.resultCell, 'p-8')}>
        {decoded.pending && 'Decoding ...'}
        {decoded.fulfilled &&
          decoded.value &&
          pipe(
            decoded.value,
            either.fold(
              (l) => `Error: ${l}` as React.ReactNode,
              (r) => <DecodeResultView decoded={r} />,
            ),
          )}
      </div>
    </>
  );
};

const DecodeResultView: React.FC<{ decoded: DecodedFile }> = ({ decoded }) => {
  const [filename, setFilename] = useState('');

  const objectUrls = useRef<string[]>([]);

  const objectUrl = useMemo(() => {
    const blob = new Blob([decoded.decoded.buffer]);

    const url = URL.createObjectURL(blob);
    objectUrls.current.push(url);

    return url;
  }, [decoded.decoded.sha1]);

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const [anchorElem, anchorOps] = useHiddenAnchor({
    download: filename,
    href: objectUrl,
  });

  return (
    <FormControl>
      {anchorElem}
      <FormLabel className="text-sm">Filename</FormLabel>
      <Input
        size="sm"
        placeholder="(type filename)"
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setFilename(ev.target.value)}
      />
      <FormLabel className="text-sm">Content Type</FormLabel>
      <Input size="sm" value="_not saved_" isReadOnly />
      <FormLabel className="text-sm">Original Size</FormLabel>
      <Input size="sm" value={`${decoded.decoded.buffer.byteLength.toLocaleString()} bytes`} isReadOnly />
      <FormLabel className="text-sm">Original SHA1</FormLabel>
      <Input size="sm" value={decoded.decoded.sha1} isReadOnly />

      <Button isFullWidth onClick={anchorOps.download} isDisabled={!filename}>
        Download
      </Button>
    </FormControl>
  );
};
