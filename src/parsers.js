import { readFileSync } from 'fs';
import { extname } from 'path';
import { safeLoad } from 'js-yaml';
import { decode } from 'ini';

const extFunctions = {
  '.json': JSON.parse,
  '.yml': safeLoad,
  '.ini': decode,
};

const getFunctionByType = type => extFunctions[type];

export default (path) => {
  const func = getFunctionByType(extname(path));
  return func(readFileSync(path, 'utf8'));
};
