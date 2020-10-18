import { RecognizedFile } from '../../core/model/pipeline';
import { paperGrids } from '../components/paper/paper-frame';
import React, { useMemo, useState } from 'react';
import { decodeFile } from '../../core/model/decode-pipeline';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { FormControl, FormLabel, Radio, RadioGroup } from '@chakra-ui/core';
import { decodePresets } from '../../core/model/decode-options';
import classNames from 'classnames';
import { useClippedIndex } from '../components/hooks/use-clipped';

export const DecoderOptions: React.FC<{ recognized: RecognizedFile }> = (props) => {
  const [presetIndex, setPresetIndex] = useClippedIndex(decodePresets);

  const decodedP = useMemo(() => decodeFile(props.recognized, decodePresets[presetIndex]), []);

  const decoded = usePromised(decodedP);

  console.log('decoded', decoded);

  return (
    <div className={classNames(paperGrids.allCells, 'p-8')}>
      <div>
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
    </div>
  );
};
