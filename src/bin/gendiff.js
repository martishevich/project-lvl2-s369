#!/usr/bin/env node

import genDiff from '../genDiff';

const program = require('commander');

program
  .version('0.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const diff = genDiff(firstConfig, secondConfig);
    console.log(diff);
  })
  .description(' Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
