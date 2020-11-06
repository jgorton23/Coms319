const willDie = require('./HelperMethods');
const updateStartPos = require('./map');

var startxPos;
var startyPos; 


test('checks to see if checkDeath function works', () => {
  expect(willDie(1, 2)).toBe(true);
});

test('checks to see if updateStartPos works', () => {
	updateStartPos("top");
	expect(startxPos.toBe(650));
}); 