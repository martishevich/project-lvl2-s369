import fs from 'fs';
import genDiff from '../src/genDiff';

const getFixturePath = file => `__test__/__fixtures__/${file}`;

test('general test', () => {
  const result = genDiff(getFixturePath('before.json'), getFixturePath('after.json'));
  const expected = fs.readFileSync(getFixturePath('result'));
  expect(result).toBe(expected);
});
