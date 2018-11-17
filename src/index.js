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

  try {
    const tmpObj = createTemporaryDirectory();
    initSignalHandling();
    createOutputDirectory();

    const data = loadData(spinner);

    writeTemplateFiles(args.outDir, tmpObj.name, data);
    await buildOutput(spinner, args.outDir, tmpObj.name);

    const endTime = Date.now();
    process.stdout.write(`Done in ${(endTime - startTime) / 1000} sec.\n`);

    opn(path.resolve(args.outDir, 'index.html'), { wait: false });
  } catch (err) {
    process.stderr.write(`Error: ${err}\n`);
    process.exit(1);
  }
}

function initSignalHandling() {
  process.on('SIGINT', () => {
    process.stdout.write('\nAborted\n');
    process.exit(1);
  });
}

function buildOutput(spinner, outDir, tmpDir) {
  return new Promise((resolve, reject) => {
    spinner.text = 'Generating output';
    webpack.build(outDir, tmpDir, (err, stats) => {
      spinner.stop();

      const info = stats.toJson();

      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        reject(info.errors);
      }

      resolve();
    });
  });
}

function writeTemplateFiles(outDir, tmpDir, data) {
  debug('Writing template files');
  writeTemplateFile('index.html.hbs', path.resolve(outDir, 'index.html'));
  writeTemplateFile('index.js.hbs', path.resolve(tmpDir, 'index.js'));
  writeTemplateFile('data.js.hbs', path.resolve(tmpDir, 'data.js'), {
    generatedTime: Date.now(),
    data: JSON.stringify(data)
  });
}

function createTemporaryDirectory() {
  debug('Creating temporary directory');
  tmp.setGracefulCleanup();
  const tmpObj = tmp.dirSync({
    template: './tmp-XXXXXX',
    unsafeCleanup: true
  });

  return tmpObj;
}

function createOutputDirectory() {
  debug(`Creating output directory "${args.outDir}"`);
  try {
    fs.mkdirSync(args.outDir);
  } catch (err) {
    if (err.code === 'EEXIST') {
      debug(`Output directory "${args.outDir}" already exists`);
    } else {
      throw err;
    }
  }
}

function loadData(spinner) {
  spinner.text = 'Loading profiling data';

  const filename = args.args[0];
  debug(`Loading profiling data: ${filename}`);

  const data = fs.readFileSync(filename, 'utf-8');
  return parseSections(data);
}
