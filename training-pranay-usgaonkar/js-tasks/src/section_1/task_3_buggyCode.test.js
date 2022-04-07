const js_t3 = require("./task_3_buggyCode");

const test_1 = 3;
const test_1_result = 27;

test(`Cube of ${test_1} is ${test_1_result} `, () => {
	expect(js_t3(test_1)).toBe(test_1_result);
});

const test_2 = -1;
const test_2_result = 0;

test(`Negative input test : Input =${test_2} should return ${test_2_result}`, () => {
	expect(js_t3(test_2)).toBe(test_2_result);
});

const test_3 = 0;
const test_3_result = 0;

test(`Zero input test : Input =${test_3} should return ${test_3_result}`, () => {
	expect(js_t3(test_2)).toBe(test_3_result);
});

const test_4 = "string";
const test_4_result = 0;

test(`String input test : Input =${test_4} should return ${test_4_result}`, () => {
	expect(js_t3(test_4)).toBe(test_4_result);
});
