const js_t2 = require("./task_2_ageToSecs");

const test_1 = 23;
const test_1_result = 725328000;

test(`Age=${test_1} has ${test_1_result} Seconds`, () => {
	expect(js_t2(test_1)).toBe(test_1_result);
});

const test_2 = -1;
const test_2_result = 0;

test(`Negative age test : Age=${test_2} should return ${test_2_result}`, () => {
	expect(js_t2(test_2)).toBe(test_2_result);
});

const test_3 = 0;
const test_3_result = 0;

test(`Zero age test : Age=${test_3} should return ${test_3_result}`, () => {
	expect(js_t2(test_2)).toBe(test_3_result);
});

const test_4 = "string";
const test_4_result = 0;

test(`String input test : Age=${test_4} should return ${test_4_result}`, () => {
	expect(js_t2(test_4)).toBe(test_4_result);
});
