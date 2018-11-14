const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const debug = require('debug')('profiler-report:templates');
const handlebars = require('handlebars');

const TEMPLATES_DIR = 'templates';

exports.writeTemplateFile = function writeTemplateFile(srcFile, destFile, context = {}) {
  debug(`Preparing template: ${srcFile}`);
  const templateSrc = readFileSync(resolve(__dirname, '..', TEMPLATES_DIR, srcFile), 'utf-8');
  const template = handlebars.compile(templateSrc);
  debug(`Executing template: ${srcFile}`);
  const output = template(context);
  debug(`Writing file: ${destFile}`);
  writeFileSync(destFile, output, 'utf-8');
};
