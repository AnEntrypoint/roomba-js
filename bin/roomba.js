#!/usr/bin/env node

const { program } = require('commander');
const RoombaCleaner = require('../index.js');
const packageJson = require('../package.json');

program
  .name('wipe-dev')
  .description('High-performance recursive node_modules removal tool')
  .version(packageJson.version);

program
  .argument('[path]', 'Path to clean (default: current directory)', '.')
  .option('-d, --dry-run', 'Show what would be removed without actually removing')
  .option('-v, --verbose', 'Verbose output')
  .option('-f, --force', 'Force removal without protection checks')
  .option('-c, --concurrent <number>', 'Number of concurrent workers', (val) => parseInt(val))
  .action(async (path, options) => {
    try {
      const cleaner = new RoombaCleaner({
        dryRun: options.dryRun,
        verbose: options.verbose,
        force: options.force,
        maxWorkers: options.concurrent
      });

      await cleaner.clean(path);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();