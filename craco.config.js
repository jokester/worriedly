module.exports = async ({ env }) => {
  if (1) {
    return {
      webpack: {
        alias: {
          react: 'preact/compat',
          'react-dom': 'preact/compat',
        },
      },
    };
  }
  return {};
};
