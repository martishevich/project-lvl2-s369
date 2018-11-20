#!/usr/bin/env node

import genDiff from '..';

const program = require('commander');

program
  .version('0.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(genDiff(firstConfig, secondConfig));
  })
  .description(' Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
