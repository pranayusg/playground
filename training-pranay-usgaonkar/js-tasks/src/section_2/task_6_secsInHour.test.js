const js_t6 = require("./task_6_secsInHour");

const test_1 = 2;
const test_1_result = 7200;

test(`Hour=${test_1} has ${test_1_result} days`, () => {
	expect(js_t6(test_1)).toBe(test_1_result);
});

const test_2 = -1;

test(`Negative Hour test : Hour=${test_2} should return false`, () => {
	expect(js_t6(test_2)).toBeFalsy();
});

const test_3 = 0;

test(`Zero Hour test : Hour=${test_3} should return false`, () => {
	expect(js_t6(test_2)).toBeFalsy();
});

const test_4 = "string";

test(`String input test : Hour=${test_4} should return false`, () => {
	expect(js_t6(test_4)).toBeFalsy();
});
