import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parsers';
import getAst from './ast';
import render from './formatters/index';

const getObj = path => parse(extname(path), readFileSync(path, 'utf8'));

export default (path1, path2, format = 'object') => {
  const obj1 = getObj(path1);
  const obj2 = getObj(path2);
  const diff = getAst(obj1, obj2);
  return render(format)(diff);
};
