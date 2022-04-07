const js_t5 = require("./task_5_sumOfTwoNums");

const test_1 = "1,2,3";
const target_1 = 5;
const test_1_result = [1, 2];

test(`Comma separated array input test: String=${test_1} with target ${target_1} should return ${test_1_result} `, () => {
	expect(js_t5(test_1, target_1)).toEqual(test_1_result);
});

const test_2 = [1, 2, 3];
const target_2 = 5;
const test_2_result = [1, 2];

test(`Array input test: Array=${test_2} with target ${target_2} should return ${test_2_result} `, () => {
	expect(js_t5(test_2, target_2)).toEqual(test_1_result);
});

const test_3 = [1];
const target_3 = 5;

test(`Array with one element test: Array=${test_3} with target ${target_3} should  throw `, () => {
	expect(js_t5(test_3, target_3)).toBeFalsy();
});

test(`Empty input test: Should return false if input is empty `, () => {
	expect(js_t5("")).toBeFalsy();
});
