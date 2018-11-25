import plain from './plain';
import object from './object';

const formatType = {
  plain,
  object,
  json: ast => JSON.stringify(ast),
};

export default format => formatType[format];
