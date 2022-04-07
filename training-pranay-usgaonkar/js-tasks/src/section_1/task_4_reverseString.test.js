const js_t4 = require("./task_4_reverseString");

const test_1 = "ivo";
const test_1_result = "ovi";

test(`Reverse of "${test_1}" is "${test_1_result}"`, () => {
	expect(js_t4(test_1)).toBe(test_1_result);
});

const test_2 = "MaLAyalAm";
const test_2_result = "mAlayALaM";

test(`MIXED-CASE test :Reverse of "${test_2}" is "${test_2_result}"`, () => {
	expect(js_t4(test_2)).toBe(test_2_result);
});

const test_3 = "hello123";
const test_3_result = "321olleh";

test(`ALPHA-Numeric test :Reverse of "${test_3}" is "${test_3_result}"`, () => {
	// console.log(js_t4(test_3));
	expect(js_t4(test_3)).toBe(test_3_result);
});
