import React, { FC, useState } from 'react';
import { HtmlHeader } from '../ui/html-headers';
import { EncoderUi } from '../ui/encoder-ui/encoder-ui';
import { AppBanner } from '../ui/banner/app-banner';

const IndexPage: FC = () => {
  const [encoding, setEncoding] = useState(true);
  return (
    <>
      <HtmlHeader />
      <AppBanner encoding={encoding} onSwitchEncoding={setEncoding} />
      {encoding ? <EncoderUi /> : <div>TODO</div>}
    </>
  );
};

export default IndexPage;
