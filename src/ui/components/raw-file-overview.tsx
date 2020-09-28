import React from 'react';
import { RawFile } from '../../core/model/pipeline';
import { Collapse, FormControl, FormLabel, Input } from '@chakra-ui/core';

export const RawFilePreview: React.FC<{ file?: RawFile | null }> = (props) => {
  return (
    <FormControl>
      <FormLabel>Filename</FormLabel>
      <Input value={props.file?.filename || ''} isReadOnly />
      <FormLabel>Content Type</FormLabel>
      <Input value={props.file?.contentType || ''} isReadOnly />
      <FormLabel>Size</FormLabel>
      <Input value={`${props.file?.inputBuffer?.byteLength?.toLocaleString() || ''} bytes`} isReadOnly />
      <FormLabel>SHA1</FormLabel>
      <Input value={props.file?.sha1 || ''} isReadOnly />
    </FormControl>
  );
};
