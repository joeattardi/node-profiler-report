const program = require('commander');

const version = require('../package.json').version;

const DEFAULT_OUTPUT_DIR = 'report';

program
  .version(version)
  .arguments('<file>')
  .option('-o, --out-dir <outDir>', 'Output directory for the report', DEFAULT_OUTPUT_DIR)
  .parse(process.argv);


if (!program.args.length) {
  process.stderr.write('Input file is required\n');
  process.stderr.write('Usage: profiler-report [options] <file>\n');
  process.exit(1);
}

module.exports = program;
