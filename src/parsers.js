import { safeLoad } from 'js-yaml';
import { decode } from 'ini';

const extFunctions = {
  '.json': JSON.parse,
  '.yml': safeLoad,
  '.ini': decode,
};

export default (extention, content) => {
  const parse = extFunctions[extention];
  return parse(content);
};
