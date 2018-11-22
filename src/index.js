import _ from 'lodash';
import parser from './parsers';

const linesDiff = [
  {
    condition: item => item.state === 'same',
    getLine: item => `    ${item.key}: ${item.value}`,
  },
  {
    condition: item => item.state === 'changed',
    getLine: item => `  + ${item.key}: ${item.newValue}\n  - ${item.key}: ${item.oldValue}`,
  },
  {
    condition: item => item.state === 'new',
    getLine: item => `  + ${item.key}: ${item.value}`,
  },
  {
    condition: item => item.state === 'deleted',
    getLine: item => `  - ${item.key}: ${item.value}`,
  },
];

const ast = [
  {
    condition: (obj1, obj2, key) => obj1[key] === obj2[key],
    state: 'same',
    values: (obj1, obj2, key) => ({ value: obj1[key] }),
  },
  {
    condition: (obj1, obj2, key) => _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    state: 'changed',
    values: (obj1, obj2, key) => ({ oldValue: obj1[key], newValue: obj2[key] }),
  },
  {
    condition: (obj1, obj2, key) => !_.has(obj1, key) && _.has(obj2, key),
    state: 'new',
    values: (obj1, obj2, key) => ({ value: obj2[key] }),
  },
  {
    condition: (obj1, obj2, key) => _.has(obj1, key) && !_.has(obj2, key),
    state: 'deleted',
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
  const obj1 = parser(path1);
  const obj2 = parser(path2);
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));

  const diff = allKeys.map((key) => {
    const { state, values } = ast.find(({ condition }) => condition(obj1, obj2, key));
    return { key, state, ...values(obj1, obj2, key) };
  });
  console.log(diff);
  return convertDiffToString(diff);
};
