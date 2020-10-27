import React, { HTMLAttributes } from 'react';
import { FAIcon } from './font-awesome-icon';
import classNames from 'classnames';

export const StepDesc: React.FC<{ className?: string }> = (props) => {
  return <div className={classNames('flex justify-center text-2xl', props.className)}>{props.children}</div>;
};

export const StepContent: React.FC = (props) => {
  return <div className="p-4">{props.children}</div>;
};

export const StepContainer: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  return <div className={classNames('my-8 px-4', props.className)}>{props.children}</div>;
};

export const StepArrow: React.FC = () => {
  return (
    <StepContainer className="justify-center flex">
      <FAIcon icon="arrow-down" />
    </StepContainer>
  );
};
