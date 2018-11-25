const processValue = (value) => {
  if (typeof value === 'object') {
    return '[complex value]';
  }
  return (typeof value === 'string') ? `'${value}'` : `${value}`;
};

const lines = {
  same: (item, prevProperty) => `Property '${prevProperty}${item.key}' was unchanged.`,
  changed: (item, prevProperty) => `Property '${prevProperty}${item.key}' was updated. From ${processValue(item.oldValue)} to ${processValue(item.newValue)}`,
  new: (item, prevProperty) => `Property '${prevProperty}${item.key}' was added with value: ${processValue(item.value)}`,
  deleted: (item, prevProperty) => `Property '${prevProperty}${item.key}' was removed`,
  nested: (item, prevProperty, func) => `${func(item.children, `${prevProperty}${item.key}.`)}`,
};

const getPlain = (ast, prevProperty = '') => ast.map(item => lines[item.type](item, prevProperty, getPlain)).join('\n');
const getStringRepresentation = ast => `${getPlain(ast)}\n`;

export default getStringRepresentation;
