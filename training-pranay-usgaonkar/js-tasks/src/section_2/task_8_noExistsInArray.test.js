const js_t8 = require("./task_8_noExistsInArray");

let test1_array_one = [1, 5, 8, 9, 10];
let test1_array_two = [5, 8, 9, 10, 12, 20, 40, 60, 70];
let test1_input_number = 10;

test(`Number ${test1_input_number} exists in both arrays`, () => {
	expect(js_t8(test1_array_one, test1_array_two, test1_input_number)).toContain(
		test1_input_number + " found in both arrays"
	);
});

let test2_array_one = [1, 5, 8, 9, 10];
let test2_array_two = [5, 8, 9, 10, 12, 20, 40, 60, 70];
let test2_input_number = 70;

test(`Number ${test2_input_number} exists in array_two`, () => {
	expect(js_t8(test2_array_one, test2_array_two, test2_input_number)).toMatch(
		/found in array_two/
	);
});

let test3_array_one = [1, 5, 8, 9, 10];
let test3_array_two = [5, 8, 9, 10, 12, 20, 40, 60, 70];
let test3_input_number = 1;

test(`Number ${test3_input_number} exists in array_two`, () => {
	expect(js_t8(test3_array_one, test3_array_two, test3_input_number)).toMatch(
		/found in array_one/
	);
});

test(`Throws exeption if input doesn't contain required parameters`, () => {
	const args = [null, undefined, NaN, "", 0, false];

	args.forEach((a) => {
		expect(() => {
			js_t8(a, a, a);
		}).toThrow();
	});
});
