import React, { FC } from 'react';
import { tailwindComponents } from '../tailwind-components';
import { Button } from '@chakra-ui/core';
import { FAIcon } from './font-awesome-icon';

export const AppBanner: FC<{
  showRestart?: boolean;
  onRestart?(): void;
}> = ({ showRestart, onRestart }) => {
  return (
    <div className="unprintable flex justify-center py-2">
      <h1 className={tailwindComponents.appTitle}>Worriedly</h1>
      <div className="inline-block">
        <a href="https://github.com/jokester/worriedly" target="_blank" rel="noreferrer noopener">
          <FAIcon icon="github" />
        </a>
        {showRestart ? (
          <Button size="sm" onClick={onRestart}>
            Restart
          </Button>
        ) : null}
      </div>
    </div>
  );
};
