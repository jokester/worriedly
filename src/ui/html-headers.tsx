import React, { FC } from 'react';
import Helmet from 'react-helmet';

export const HtmlHeader: FC = props => {
  return (
    <Helmet>
      <title>Worriedly</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.1.2/tailwind.min.css"
        integrity="sha256-bCQF5OufWlWM/MW9mCb/eDibvff1W8BNq9ZK69C8FSI="
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};
