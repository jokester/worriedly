import { FunctionComponent } from 'react';
import React from 'react';
import { tailwindComponents } from '../tailwind-components';

export const DecoderSteps: FunctionComponent<{ step: number }> = ({ step: selectedStep }) => (
  <div className={tailwindComponents.stepsContainer}>
    <span className={tailwindComponents.step(1, selectedStep)}>printed QR code</span>
    <span>{'+'}</span>
    <span className={tailwindComponents.step(2, selectedStep)}>options</span>
    <span>{'=>'}</span>
    <span className={tailwindComponents.step(3, selectedStep)}>bytes</span>
  </div>
);
