import { FunctionComponent } from 'react';
import React from 'react';
import { tailwindComponents } from '../tailwind-components';

export const EncoderSteps: FunctionComponent<{ step: number }> = ({ step: selectedStep }) => (
  <div className={tailwindComponents.stepsContainer}>
    <span className={tailwindComponents.step(1, selectedStep)}>bytes</span>
    <span>{'+'}</span>
    <span className={tailwindComponents.step(2, selectedStep)}>options</span>
    <span>{'=>'}</span>
    <span className={tailwindComponents.step(3, selectedStep)}>printable QR code</span>
  </div>
);
