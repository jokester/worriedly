import { FunctionComponent } from 'react';
import React from 'react';
import { tailwindComponents } from '../tailwind-components';

export const StepsIndicator: FunctionComponent<{ step: number }> = ({ step: selectedStep }) => (
  <div className={tailwindComponents.stepsContainer}>
    <span className={tailwindComponents.step(1, selectedStep)}>a file</span>
    <span>{'+'}</span>
    <span className={tailwindComponents.step(2, selectedStep)}>a few options</span>
    <span>{'=>'}</span>
    <span className={tailwindComponents.step(3, selectedStep)}>printable QR code</span>
  </div>
);
