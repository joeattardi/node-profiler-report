const { resolve } = require('path');

const debug = require('debug')('profiler-report:webpack');
const webpack = require('webpack');

exports.build = function build(outputDir, tmpDir, callback) {
  const compiler = webpack({
    context: resolve(__dirname, '..'),
    entry: resolve(tmpDir, 'index.js'),
    output: {
      path: resolve(outputDir),
      publicPath: '/',
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        components: resolve(__dirname, '..', 'components'),
        data: resolve(tmpDir, 'data')
      },
      extensions: ['.js', '.jsx'],
      modules: [resolve(__dirname, '..', 'node_modules')]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cwd: resolve(__dirname, '..'),
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
        }
      ]
    }
  });

  debug('Running webpack compiler');
  return compiler.run(callback);
};
