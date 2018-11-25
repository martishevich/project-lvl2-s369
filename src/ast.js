import _ from 'lodash';

const ast = [
  {
    condition: (obj1, obj2, key) => obj1[key] instanceof Object && obj2[key] instanceof Object,
    type: 'nested',
    values: (value1, value2, generateAst) => ({ children: generateAst(value1, value2) }),
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

const generateAst = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  return allKeys.map((key) => {
    const { type, values } = ast.find(({ condition }) => condition(obj1, obj2, key));
    return { key, type, ...values(obj1[key], obj2[key], generateAst) };
  });
};

export default generateAst;
