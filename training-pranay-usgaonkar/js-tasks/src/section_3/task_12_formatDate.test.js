const js_t12 = require("./task_12_formatDate");

let test1 = "20-10-2021";
let output1 = "20th Oct 2021";

test(`Should return correct date with prefix th`, () => {
	expect(js_t12(test1)).toBe(output1);
});

let test2 = "21-05-2021";
let output2 = "21st May 2021";

test(`Should return correct date with prefix st`, () => {
	expect(js_t12(test2)).toBe(output2);
});
