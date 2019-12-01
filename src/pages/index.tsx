import React, { FC } from 'react';
import { HtmlHeader } from '../ui/html-headers';
import { PaperPage } from '../ui/paper-page/paper-page';
import { PaperUI } from '../ui/paper-ui/paper-ui';

const IndexPage: FC = () => (
  <>
    <HtmlHeader />
    <PaperPage>
      <PaperUI />
    </PaperPage>
  </>
);

export default IndexPage;
