import React from 'react';
import { ThemeProvider } from '@chakra-ui/core';
import { HtmlHeader } from '../html-headers';

export const LayoutRoot: React.FC = (props) => {
  return (
    <ThemeProvider>
      <HtmlHeader />
      {props.children}
    </ThemeProvider>
  );
};
