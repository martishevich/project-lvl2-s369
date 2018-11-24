import { readFileSync } from 'fs';
import genDiff from '../src';

const getFixturePath = file => `__tests__/__fixtures__/${file}`;

test('JSON', () => {
  const result = genDiff(getFixturePath('before.json'), getFixturePath('after.json'));
  const expected = readFileSync(getFixturePath('result'), 'utf8');
  expect(result).toBe(expected);
});

test('YML', () => {
  const result = genDiff(getFixturePath('before.yml'), getFixturePath('after.yml'));
  const expected = readFileSync(getFixturePath('result'), 'utf8');
  expect(result).toBe(expected);
});

test('INI', () => {
  const result = genDiff(getFixturePath('before.ini'), getFixturePath('after.ini'));
  const expected = readFileSync(getFixturePath('result'), 'utf8');
  expect(result).toBe(expected);
});

test('JSON nested', () => {
  const result = genDiff(getFixturePath('beforeNested.json'), getFixturePath('afterNested.json'));
  const expected = readFileSync(getFixturePath('resultNested'), 'utf8');
  expect(result).toBe(expected);
});

test('YML nested', () => {
  const result = genDiff(getFixturePath('beforeNested.yml'), getFixturePath('afterNested.yml'));
  const expected = readFileSync(getFixturePath('resultNested'), 'utf8');
  expect(result).toBe(expected);
});

test('INI nested', () => {
  const result = genDiff(getFixturePath('beforeNested.ini'), getFixturePath('afterNested.ini'));
  const expected = readFileSync(getFixturePath('resultNested'), 'utf8');
  expect(result).toBe(expected);
});
