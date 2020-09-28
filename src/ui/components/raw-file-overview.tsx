import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/core';

export const RawFilePreview: React.FC<{
  file?: {
    filename?: string;
    contentType?: string;
    size?: number;
    sha1?: string;
  };
}> = (props) => {
  return (
    <FormControl>
      <FormLabel>Filename</FormLabel>
      <Input value={props.file?.filename || ''} isReadOnly />
      <FormLabel>Content Type</FormLabel>
      <Input value={props.file?.contentType || ''} isReadOnly />
      <FormLabel>Size</FormLabel>
      <Input value={`${props.file?.size?.toLocaleString() || ''} bytes`} isReadOnly />
      <FormLabel>SHA1</FormLabel>
      <Input value={props.file?.sha1 || ''} isReadOnly />
    </FormControl>
  );
};
