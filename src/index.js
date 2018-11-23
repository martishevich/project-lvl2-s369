import { readFileSync } from 'fs';
import _ from 'lodash';
import { extname } from 'path';
import parse from './parsers';

const linesDiff = [
  {
    condition: item => item.type === 'same',
    getLine: item => `    ${item.key}: ${item.value}`,
  },
  {
    condition: item => item.type === 'changed',
    getLine: item => `  + ${item.key}: ${item.newValue}\n  - ${item.key}: ${item.oldValue}`,
  },
  {
    condition: item => item.type === 'new',
    getLine: item => `  + ${item.key}: ${item.value}`,
  },
  {
    condition: item => item.type === 'deleted',
    getLine: item => `  - ${item.key}: ${item.value}`,
  },
];

const ast = [
  {
    condition: (obj1, obj2, key) => obj1[key] === obj2[key],
    type: 'same',
    values: (obj1, obj2, key) => ({ value: obj1[key] }),
  },
  {
    condition: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    type: 'changed',
    values: (obj1, obj2, key) => ({ oldValue: obj1[key], newValue: obj2[key] }),
  },
  {
    condition: (obj1, obj2, key) => !_.has(obj1, key) && _.has(obj2, key),
    type: 'new',
    values: (obj1, obj2, key) => ({ value: obj2[key] }),
  },
  {
    condition: (obj1, obj2, key) => _.has(obj1, key) && !_.has(obj2, key),
    type: 'deleted',
    values: (obj1, obj2, key) => ({ value: obj1[key] }),
  },
];

const convertDiffToString = (diff) => {
  const stringDiff = diff.map((item) => {
    const { getLine } = linesDiff.find(({ condition }) => condition(item));
    return getLine(item);
  }).join('\n');
  return `{\n${stringDiff}\n}\n`;
};

export default (path1, path2) => {
  const obj1 = parse(extname(path1), readFileSync(path1, 'utf8'));
  const obj2 = parse(extname(path2), readFileSync(path2, 'utf8'));
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));

  const diff = allKeys.map((key) => {
    const { type, values } = ast.find(({ condition }) => condition(obj1, obj2, key));
    return { key, type, ...values(obj1, obj2, key) };
  });
  console.log(diff);
  return convertDiffToString(diff);
};
