const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  entry: './demo/index.tsx',
  output: {
    path: path.join(__dirname, 'docs', 'demo'),
    filename: '[name].[chunkhash:8].js',
  },
  // devtool: 'source-map',
  target: 'web',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false,
            compilerOptions: {
              jsx: 'react',
              noEmit: false,
            },
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/index.template.html',
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
