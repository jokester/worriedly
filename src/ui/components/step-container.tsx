import React from 'react';
import { FAIcon } from './font-awesome-icon';
import classNames from 'classnames';

export const StepDesc: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={classNames('h-full w-40 flex justify-center flex-shrink-0', props.className)}>{props.children}</div>
  );
};

export const StepContent: React.FC = (props) => {
  return <div className="h-full flex-1">{props.children}</div>;
};

export const StepContainer: React.FC = (props) => {
  return <div className="flex my-8">{props.children}</div>;
};

export const StepArrow: React.FC = () => {
  return (
    <StepContainer>
      <StepDesc>
        <FAIcon icon="arrow-down" />
      </StepDesc>
    </StepContainer>
  );
};
