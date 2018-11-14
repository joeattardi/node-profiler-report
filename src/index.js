#! /usr/bin/env node

const debug = require('debug')('profiler-report');
const opn = require('opn');
const ora = require('ora');
const tmp = require('tmp');
const webpack = require('./webpack');

const fs = require('fs');
const path = require('path');

const args = require('./arguments');
const { parseSections } = require('./data');
const { writeTemplateFile } = require('./templates');

main();

async function main() {
  const startTime = Date.now();

  const spinner = ora().start();

  debug('Creating temporary directory');
  tmp.setGracefulCleanup();
  const tmpObj = tmp.dirSync({
    template: './tmp-XXXXXX',
    unsafeCleanup: true
  });

  debug(`Creating output directory "${args.outDir}"`);
  try {
    fs.mkdirSync(args.outDir);
  } catch (err) {
    if (err.code === 'EEXIST') {
      debug(`Output directory "${args.outDir}" already exists`);
    } else {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    }
  }

  spinner.text = 'Loading profiling data';
  const data = loadData();

  debug('Writing template files');
  writeTemplateFile('index.html.hbs', path.resolve(args.outDir, 'index.html'));
  writeTemplateFile('index.js.hbs', path.resolve(tmpObj.name, 'index.js'));
  writeTemplateFile('data.js.hbs', path.resolve(tmpObj.name, 'data.js'), {
    generatedTime: Date.now(),
    data: JSON.stringify(data)
  });

  spinner.text = 'Generating output';
  webpack.build(args.outDir, tmpObj.name, (err, stats) => {
    spinner.stop();

    const info = stats.toJson();

    if (err) {
      process.stderr.write(`Error: ${err}\n`);
    } else if (stats.hasErrors()) {
      process.stderr.write(`Error: ${info.errors[0]}\n`);
    }

    tmpObj.removeCallback();

    const endTime = Date.now();
    process.stdout.write(`Done in ${(endTime - startTime) / 1000} sec.\n`);

    opn(path.resolve(args.outDir, 'index.html'), { wait: false });
  });
}

function loadData() {
  const filename = args.args[0];
  debug(`Loading profiling data: ${filename}`);

  const data = fs.readFileSync(filename, 'utf-8');
  return parseSections(data);
}
