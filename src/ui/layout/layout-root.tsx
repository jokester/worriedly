import React from 'react';
import { ThemeProvider } from '@chakra-ui/core';

export const LayoutRoot: React.FC = (props) => {
  return (
    <ThemeProvider>
      {props.children}
    </ThemeProvider>
  );
};
