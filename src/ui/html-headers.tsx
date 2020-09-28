import React, { FC } from 'react';
import Helmet from 'react-helmet';

export const HtmlHeader: FC = (props) => {
  return (
    <Helmet>
      <title>Worriedly</title>

      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3.0, minimum-scale=0.9" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/tailwindcss@1.8.10/dist/tailwind.min.css"
        integrity="sha256-iDkm+6+g02b+JwSCy00as47Ywhx+tP+NvegUVP+Wsa8="
        crossOrigin="anonymous"
      />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css"
        integrity="sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0="
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};
