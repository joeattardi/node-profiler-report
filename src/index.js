#! /usr/bin/env node

const debug = require('debug')('profiler-report');
const opn = require('opn');
const ora = require('ora');
const tmp = require('tmp');
const webpack = require('./webpack');

const fs = require('fs');
const path = require('path');

const { parseSections } = require('./data');
const { writeTemplateFile } = require('./templates');

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

  webpack.build(OUTPUT_DIR, tmpObj.name, (err, stats) => {
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

    opn(path.resolve(OUTPUT_DIR, 'index.html'), { wait: false });
  });
}

function loadData() {
  const filename = process.argv[2];
  debug(`Loading profiling data: ${filename}`);

  const data = fs.readFileSync(filename, 'utf-8');
  return parseSections(data);
}
