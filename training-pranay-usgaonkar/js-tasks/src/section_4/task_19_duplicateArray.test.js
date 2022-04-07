const js_t19 = require("./task_19_duplicateArray");

const test_1 = [1, 5, 5, 5, 8, 9, 9, 9, 10];
const test_1_result = [5, 9, 1, 8, 10];

test(`"${test_1}" contains "${test_1_result}"`, () => {
	// console.log(js_t19(test_1));
	expect(js_t19(test_1)).toEqual(expect.arrayContaining(test_1_result));
});

const test_2 = ["hi", "hi", "hello"];
const test_2_result = ["hi"];

test(`"${test_2}" contains "${test_2_result}"`, () => {
	expect(js_t19(test_2)).toEqual(expect.arrayContaining(test_2_result));
});
