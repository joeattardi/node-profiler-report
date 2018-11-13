#! /usr/bin/env node

const debug = require('debug')('profiler-report');
const handlebars = require('handlebars');
const ora = require('ora');
const tmp = require('tmp');
const webpack = require('webpack');

const fs = require('fs');
const path = require('path');

const { parseSections } = require('./data');

const TEMPLATES_DIR = 'templates';

const OUTPUT_DIR = 'report';

main();

async function main() {
  const spinner = ora().start();

  debug('Creating temporary directory');
  tmp.setGracefulCleanup();
  const tmpObj = tmp.dirSync({
    template: './tmp-XXXXXX',
    unsafeCleanup: true
  });

  debug('Creating output directory');
  fs.mkdirSync(OUTPUT_DIR);

  const data = loadData();

  debug('Writing template files');
  writeTemplateFile('index.html.hbs', path.resolve(OUTPUT_DIR, 'index.html'));
  writeTemplateFile('index.js.hbs', path.resolve(tmpObj.name, 'index.js'));
  writeTemplateFile('data.js.hbs', path.resolve(tmpObj.name, 'data.js'), {
    generatedTime: Date.now(),
    data: JSON.stringify(data)
  });

  debug('Copying components');

  const compiler = webpack({
    context: path.resolve(__dirname, '..'),
    entry: path.resolve(tmpObj.name, 'index.js'),
    output: {
      path: path.resolve(OUTPUT_DIR),
      publicPath: '/',
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, '..', 'components'),
        data: path.resolve(tmpObj.name, 'data')
      },
      extensions: ['.js', '.jsx'],
      modules: [
        path.resolve(__dirname, '..', 'node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cwd: path.resolve(__dirname, '..'),
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        }
      ]
    }
  });

  debug('Running webpack build');
  compiler.run((err, stats) => {
    spinner.stop();

    const info = stats.toJson();

    if (err) {
      console.log('Error:', err);
    } else if (stats.hasErrors()) {
      console.log('Error:', info.errors[0]);
    } else {
      console.log('Done');
    }

    tmpObj.removeCallback();
  });
}

function loadData() {
  const filename = process.argv[2];
  debug(`Loading profiling data: ${filename}`);

  const data = fs.readFileSync(filename, 'utf-8');
  return parseSections(data);
}

function writeTemplateFile(srcFile, destFile, context = {}) {
  debug(`Preparing template: ${srcFile}`);
  const templateSrc = fs.readFileSync(path.resolve(__dirname, '..', TEMPLATES_DIR, srcFile), 'utf-8');
  const template = handlebars.compile(templateSrc);
  debug(`Executing template: ${srcFile}`);
  const output = template(context);
  debug(`Writing file: ${destFile}`);
  fs.writeFileSync(destFile, output, 'utf-8');
}
