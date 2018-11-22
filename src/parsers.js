import { readFileSync } from 'fs';
import { extname } from 'path';
import { safeLoad } from 'js-yaml';

const extFunctions = {
  '.json': JSON.parse,
  '.yml': safeLoad,
};

const getFunctionByType = type => extFunctions[type];

export default (path) => {
  const func = getFunctionByType(extname(path));
  return func(readFileSync(path, 'utf8'));
};
