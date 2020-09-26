import React from 'react';
import classNames from 'classnames';

/**
 * @link https://fontawesome.com/v4.7.0/icons/
 * @link https://fontawesome.com/v4.7.0/examples/
 *
 */
export const FAIcon: React.FC<{
  icon: string;
  size?: 'lg' | '2x' | '3x' | '4x' | '5x';
  fw?: boolean;
  spin?: boolean;
}> = (props) => (
  <i
    className={classNames(`fa fa-${props.icon}`, props.size ? `fa-${props.size}` : '', {
      'fa-fw': props.fw,
      'fa-spin': props.spin,
    })}
  />
);
