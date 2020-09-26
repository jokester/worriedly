exports.onCreateWebpackConfig = ({ actions, stage }) => {
  0 &&
    actions.setWebpackConfig({
      devServer: {
        port: 443,
      },
    });
  0 &&
    actions.setWebpackConfig({
      externals: [
        {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      ],
    });
};
