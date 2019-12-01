import React, { FC } from 'react';
import { tailwindComponents } from '../tailwind-components';

export const AppBanner: FC = props => {
  return (
    <div className="unprintable">
      <div className="unprintable">
        <h1 className={tailwindComponents.appTitle}>Worriedly</h1>
        <a href="https://github.com/jokester/worriedly" target="_blank" rel="noreferrer noopener">
          github
        </a>
      </div>
      <hr className="unprintable" />
    </div>
  );
};
