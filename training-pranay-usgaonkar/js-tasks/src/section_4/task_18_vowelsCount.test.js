const js_t18 = require("./task_18_vowelsCount");

const test_1 = "ivo";
const test_1_result = 2;

test(`"${test_1}" contains "${test_1_result}"`, () => {
	expect(js_t18(test_1)).toBe(test_1_result);
});
