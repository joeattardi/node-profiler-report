const program = require('commander');

const version = require('../package.json').version;

const DEFAULT_OUTPUT_DIR = 'report';

const VALID_ENVIRONMENTS = ['development', 'production', 'none'];
const DEFAULT_ENVIRONMENT = 'production';

program
  .version(version)
  .arguments('<file>')
  .option('-o, --out-dir <outDir>', 'Output directory for the report', DEFAULT_OUTPUT_DIR)
  .option('-e --environment <environment>', 'Environment to use when building the report', DEFAULT_ENVIRONMENT)
  .parse(process.argv);


if (!program.args.length) {
  process.stderr.write('Input file is required\n');
  process.stderr.write('Usage: profiler-report [options] <file>\n');
  process.exit(1);
}

if (!(VALID_ENVIRONMENTS.includes(program.environment))) {
  process.stderr.write('Invalid environment specified\n');
  process.stderr.write(`Valid environments are: ${VALID_ENVIRONMENTS.join(', ')}\n`);
  process.exit(1);
}

module.exports = program;
