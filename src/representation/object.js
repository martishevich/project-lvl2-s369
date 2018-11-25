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

const convertDiffToString = (astObj, depth = 1) => {
  const spaceCount = depth * spaceAmount;
  const newDepth = depth + 1;
  const stringDiff = astObj.map((item) => {
    const getLine = linesDiff[item.type];
    return getLine(item, spaceCount, newDepth, convertDiffToString);
  }).join('\n');
  return `{\n${stringDiff}\n${' '.repeat(spaceCount - spaceAmount)}}`;
};

const getStringRepresentation = diff => `${convertDiffToString(diff)}\n`;

export default getStringRepresentation;
