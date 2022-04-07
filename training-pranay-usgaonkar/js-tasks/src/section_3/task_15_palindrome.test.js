const js_t15 = require("./task_15_palindrome");

let test1_result = 906609;
test(`Largest palindrome made from the product of two 3-digit numbers is ${test1_result}`, () => {
	expect(js_t15()).toBe(test1_result);
});
