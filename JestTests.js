const sum = require('./map');

test('checks to see if checkDeath function works', () => {
  expect(willDie(1, 2)).toBe(true);
});