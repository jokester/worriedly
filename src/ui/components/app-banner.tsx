import React, { FC } from 'react';
import { tailwindComponents } from '../tailwind-components';
import { Button } from '@chakra-ui/react';
import { FAIcon } from './font-awesome-icon';
import classNames from 'classnames';
import { styleOnlyComponents } from '../styles/style-only-components';

const surroundingBlock = 'inline-flex justify-center items-center w-48 px-4';

export const AppBanner: FC<{
  showRestart?: boolean;
  onRestart?(): void;
}> = ({ showRestart, onRestart }) => {
  return (
    <div
      className={classNames(
        styleOnlyComponents.noPrint,
        'flex mx-auto max-w-screen-sm justify-around content-center py-6 unprintable',
      )}
    >
      <div className={surroundingBlock}>
        <Button
          size="sm"
          onClick={onRestart}
          className={classNames('px-2', {
            invisible: !showRestart,
          })}
        >
          Start over
        </Button>
      </div>
      <h1 className={tailwindComponents.appTitle}>Worriedly</h1>
      <div className={surroundingBlock}>
        <a href="https://github.com/jokester/worriedly" target="_blank" rel="noreferrer noopener">
          <FAIcon icon="github" fw size="lg" />
        </a>
      </div>
    </div>
  );
};
