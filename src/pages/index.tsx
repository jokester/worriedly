import React, { FC, useState } from 'react';
import { HtmlHeader } from '../ui/html-headers';
import { PaperUI } from '../ui/encoder-ui/paper-ui';
import { AppBanner } from '../ui/banner/app-banner';

const IndexPage: FC = () => {
  const [encoding, setEncoding] = useState(true);
  return (
    <>
      <HtmlHeader />
      <AppBanner />
      <PaperUI />
    </>
  );
};

export default IndexPage;
