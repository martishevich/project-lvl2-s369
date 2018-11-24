import { readFileSync } from 'fs';
import _ from 'lodash';
import { extname } from 'path';
import parse from './parsers';

const spaceAmount = 4;

const stringify = (item, spaces) => {
  if (typeof item !== 'object') {
    return item;
  }
  const keys = Object.keys(item);
  const data = keys.map(key => `${' '.repeat(spaces + spaceAmount)}${key}: ${stringify(item[key], spaces + spaceAmount)}`).join('\n');
  return `{\n${data}\n${' '.repeat(spaces)}}`;
};

const linesDiff = {
  same: (item, spaces) => `${' '.repeat(spaces - 2)}  ${item.key}: ${stringify(item.value, spaces)}`,
  changed: (item, spaces) => `${' '.repeat(spaces - 2)}+ ${item.key}: ${stringify(item.newValue, spaces)}\n${' '.repeat(spaces - 2)}- ${item.key}: ${stringify(item.oldValue, spaces)}`,
  new: (item, spaces) => `${' '.repeat(spaces - 2)}+ ${item.key}: ${stringify(item.value, spaces)}`,
  deleted: (item, spaces) => `${' '.repeat(spaces - 2)}- ${item.key}: ${stringify(item.value, spaces)}`,
  nested: (item, spaces, depth, convertDiffToString) => `${' '.repeat(spaces)}${item.key}: ${convertDiffToString(item.childrens, depth)}`,
};

const ast = [
  {
    condition: (obj1, obj2, key) => obj1[key] instanceof Object && obj2[key] instanceof Object,
    type: 'nested',
    values: (value1, value2, generateAst) => ({ childrens: generateAst(value1, value2) }),
  },
  {
    condition: (obj1, obj2, key) => obj1[key] === obj2[key],
    type: 'same',
    values: (value1, value2) => ({ value: value2 }),
  },
  {
    condition: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    type: 'changed',
    values: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
  {
    condition: (obj1, obj2, key) => !_.has(obj1, key) && _.has(obj2, key),
    type: 'new',
    values: (value1, value2) => ({ value: value2 }),
  },
  {
    condition: (obj1, obj2, key) => _.has(obj1, key) && !_.has(obj2, key),
    type: 'deleted',
    values: value1 => ({ value: value1 }),
  },
];

const convertDiffToString = (astObj, depth = 1) => {
  const spaceCount = depth * spaceAmount;
  const newDepth = depth + 1;
  const stringDiff = astObj.map((item) => {
    const getLine = linesDiff[item.type];
    return getLine(item, spaceCount, newDepth, convertDiffToString);
  }).join('\n');
  return `{\n${stringDiff}\n${' '.repeat(spaceCount - spaceAmount)}}`;
};

const generateAst = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  return allKeys.map((key) => {
    const { type, values } = ast.find(({ condition }) => condition(obj1, obj2, key));
    return { key, type, ...values(obj1[key], obj2[key], generateAst) };
  });
};

export default (path1, path2) => {
  const obj1 = parse(extname(path1), readFileSync(path1, 'utf8'));
  const obj2 = parse(extname(path2), readFileSync(path2, 'utf8'));
  const diff = generateAst(obj1, obj2);
  return `${convertDiffToString(diff)}\n`;
};
