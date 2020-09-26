import React, { FC, useState } from 'react';
import { HtmlHeader } from '../ui/html-headers';
import { EncoderUi } from '../ui/encoder-ui/encoder-ui';
import { DecoderUI } from '../ui/decoder-ui/decoder-ui';
import { LayoutRoot } from '../ui/layout/layout-root';
import { Main } from "../ui/main";

const IndexPage: FC = () => {
  return (
    <LayoutRoot>
      <Main />
    </LayoutRoot>
  );
};

export default IndexPage;
