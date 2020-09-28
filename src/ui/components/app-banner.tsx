import React, { FC } from 'react';
import { tailwindComponents } from '../tailwind-components';
import { Button } from '@chakra-ui/core';
import { FAIcon } from './font-awesome-icon';
import classNames from 'classnames';

const surroundingBlock = 'inline-flex w-1/5 justify-center items-center ';

export const AppBanner: FC<{
  showRestart?: boolean;
  onRestart?(): void;
}> = ({ showRestart, onRestart }) => {
  return (
    <div className="unprintable py-2 ">
      <div className="flex mx-auto max-w-screen-sm justify-around content-center">
        <div className={surroundingBlock}>
          <Button
            size="sm"
            onClick={onRestart}
            className={classNames({
              invisible: false, //!showRestart,
            })}
          >
            Restart
          </Button>
        </div>
        <h1 className={tailwindComponents.appTitle}>Worriedly</h1>
        <div className={surroundingBlock}>
          <a href="https://github.com/jokester/worriedly" target="_blank" rel="noreferrer noopener">
            <FAIcon icon="github" fw size="lg" />
          </a>
        </div>
      </div>
    </div>
  );
};