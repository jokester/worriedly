import React, { FC } from 'react';
import Helmet from 'react-helmet';

export const HtmlHeader: FC = props => {
  return (
    <Helmet>
      <title>Worriedly</title>
    </Helmet>
  );
};
