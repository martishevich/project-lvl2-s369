import plain from './plain';
import object from './object';

const formatType = {
  plain,
  object,
};

export default format => formatType[format];
