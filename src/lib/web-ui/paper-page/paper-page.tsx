import React from 'preact/compat';
import { FunctionComponent } from 'preact';

import './paper-page.scss';

import { createAspectRatioStyle } from '../aspect-ratio/aspect-ratio';

export const PaperPage: FunctionComponent = ({ children }) => {
  return (
    <div className="paper-page-container">
      <div className="paper-page" style={createAspectRatioStyle(210 / 297)}>
        {children}
      </div>
    </div>
  );
};
