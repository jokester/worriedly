import { FunctionComponent } from 'react';
import React from 'react';
import classNames from 'classnames';

export const StepsIndicator: FunctionComponent<{ step: number }> = ({ step }) => (
  <div className="steps-indicator">
    <ol>
      <li className={classNames('step', { current: step === 1, future: step < 1 })}>1. Select a file</li>
      <li className={classNames('step', { current: step === 2, future: step < 2 })}>2. Set options</li>
      <li className={classNames('step', { current: step === 3, future: step < 3 })}>3. Generate print-ready QR code</li>
    </ol>
  </div>
);
