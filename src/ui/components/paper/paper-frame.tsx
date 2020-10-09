import styles from './paper-frame.module.scss';
import React from 'react';
import classNames from 'classnames';

export const paperGrids = {
  controlCell: styles.controlGrid as string,
  resultCell: styles.resultGrid as string,
  allCells: styles.allGrids as string,
} as const;

export const PaperFrame: React.FC<{ className?: string }> = (props) => (
  <div className={classNames(props.className, styles.paperFrame)}>{props.children}</div>
);
