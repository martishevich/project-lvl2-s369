import { safeLoad } from 'js-yaml';
import { decode } from 'ini';

const extFunctions = {
  '.json': JSON.parse,
  '.yml': safeLoad,
  '.ini': decode,
};

export default (extention, file) => {
  const parse = extFunctions[extention];
  return parse(file);
};
