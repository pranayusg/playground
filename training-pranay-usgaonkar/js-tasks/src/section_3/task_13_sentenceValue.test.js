const js_t13 = require("./task_13_sentenceValue");

let test1 = "Test";
let test1_result = 104;

test(`Sentence with ${test1} should return ${test1_result}`, () => {
	expect(js_t13(test1)).toBe(104);
});

let test2 = "Test2";

test(`Should throw error if input is alphamuneric`, () => {
	expect(() => {
		js_t13(test2);
	}).toThrow();
});

test(`Throws exeption if input doesn't contain required parameter`, () => {
	const args = [null, undefined, NaN, "", 0, false];

	args.forEach((a) => {
		expect(() => {
			js_t13(a);
		}).toThrow();
	});
});
