const js_t17 = require("./task_17_checkPalindrome");

const test_1 = "ivo";

test(`"${test_1}" is not a palindrome`, () => {
	expect(js_t17(test_1)).toBeFalsy();
});

const test_2 = "malayalam";

test(`All lowercase text :"${test_2}" is a palindrome `, () => {
	expect(js_t17(test_2)).toBeTruthy();
});

const test_3 = "MALAYALAM";

test(`All UPPER-CASE text :"${test_3}" is a palindrome `, () => {
	expect(js_t17(test_3)).toBeTruthy();
});

const test_4 = "MaLAyalAm";

test(`MIXED-CASE text :"${test_4}" is a palindrome`, () => {
	expect(js_t17(test_4)).toBeTruthy();
});

const test_5 = "A Man, A Plan, A Canal – Panama!";

test(`Alphanumeric text :"${test_5}" is a palindrome`, () => {
	expect(js_t17(test_5)).toBeTruthy();
});
