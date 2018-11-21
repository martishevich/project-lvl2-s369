import { readFileSync } from 'fs';
import _ from 'lodash';

const getObject = path => JSON.parse(readFileSync(path, 'utf8'));

const getLineFromDiff = (acc, item) => {
  let line;
  if (item.state === 'same') {
    line = `\n    ${item.key}: ${item.value}`;
  }
  if (item.state === 'changed') {
    line = `\n  + ${item.key}: ${item.newValue}`;
    line += `\n  - ${item.key}: ${item.oldValue}`;
  }
  if (item.state === 'new') {
    line = `\n  + ${item.key}: ${item.value}`;
  }
  if (item.state === 'deleted') {
    line = `\n  - ${item.key}: ${item.value}`;
  }
  return acc + line;
};

const convertDiffToString = (diff) => {
  const stringDiff = diff.reduce(getLineFromDiff, '{');
  return `${stringDiff}\n}`;
};

export default (path1, path2) => {
  const obj1 = getObject(path1);
  const obj2 = getObject(path2);
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const diff = allKeys.reduce((acc, key) => {
    let result = {};
    if (obj1[key] === obj2[key]) {
      result = {
        state: 'same',
        key,
        value: obj1[key],
      };
    }
    if (_.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key]) {
      result = {
        state: 'changed',
        key,
        oldValue: obj1[key],
        newValue: obj2[key],
      };
    }
    if (!_.has(obj1, key) && _.has(obj2, key)) {
      result = {
        state: 'new',
        key,
        value: obj2[key],
      };
    }
    if (_.has(obj1, key) && !_.has(obj2, key)) {
      result = {
        state: 'deleted',
        key,
        value: obj1[key],
      };
    }
    return [...acc, result];
  }, []);
  return convertDiffToString(diff);
};
