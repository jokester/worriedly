import React, { FC } from 'react';
import { tailwindComponents } from '../tailwind-components';

export const AppBanner: FC<{ encoding: boolean; onSwitchEncoding(encoding: boolean): void }> = ({
  encoding,
  onSwitchEncoding,
}) => {
  return (
    <div className="unprintable flex justify-center py-2">
      <h1 className={tailwindComponents.appTitle}>Worriedly</h1>
      <div className="inline-block">
        <a href="https://github.com/jokester/worriedly" target="_blank" rel="noreferrer noopener">
          github
        </a>
        <button
          disabled={encoding}
          className={tailwindComponents.button(encoding)}
          onClick={() => onSwitchEncoding(true)}
        >
          {'File > QR'}
        </button>
        <button
          disabled={!encoding}
          className={tailwindComponents.button(!encoding)}
          onClick={() => onSwitchEncoding(false)}
        >
          {'QR > File'}
        </button>
      </div>
    </div>
  );
};
