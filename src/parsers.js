import { safeLoad } from 'js-yaml';
import { decode } from 'ini';

const extFunctions = {
  '.json': JSON.parse,
  '.yml': safeLoad,
  '.ini': decode,
};

export default (extantion, file) => {
  const parse = extFunctions[extantion];
  return parse(file);
};
