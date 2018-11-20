import { readFileSync } from 'fs';
import genDiff from '../src';

const getFixturePath = file => `__tests__/__fixtures__/${file}`;

test('general test', () => {
  const result = genDiff(getFixturePath('before.json'), getFixturePath('after.json'));
  const expected = readFileSync(getFixturePath('result'), 'utf8');
  expect(result).toBe(expected);
});
