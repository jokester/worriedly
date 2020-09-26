import React from 'react';
import { tailwindComponents } from '../tailwind-components';
import { FAIcon } from '../components/font-awesome-icon';

export const EncoderSteps: React.FC<{ step: number }> = ({ step: selectedStep }) => (
  <div className={tailwindComponents.stepsContainer}>
    <span className={tailwindComponents.step(1, selectedStep)}>Pick a file</span>
    <FAIcon icon="arrow-right" size="lg" />
    <span className={tailwindComponents.step(2, selectedStep)}>Config</span>
    <FAIcon icon="arrow-right" size="lg" />
    <span className={tailwindComponents.step(3, selectedStep)}>Print</span>
  </div>
);
