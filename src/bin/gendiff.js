#!/usr/bin/env node

import genDiff from '..';
import program from 'commander';

program
  .version('0.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, options) => {
    console.log(genDiff(firstConfig, secondConfig, options.format));
  })
  .description(' Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'json')
  .parse(process.argv);
