import React, { FC, useState } from 'react';
import { LayoutRoot } from '../ui/layout/layout-root';
import { AppBanner } from '../ui/components/app-banner';
import { Main } from '../ui/main';

const IndexPage: FC = () => {
  const [startCount, setStartCount] = useState(0);
  return (
    <LayoutRoot>
      <AppBanner onRestart={() => setStartCount((_) => _ + 1)} />
      <Main key={startCount} />
    </LayoutRoot>
  );
};

export default IndexPage;
