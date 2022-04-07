const js_t14 = require("./task_14_analyzeNames");

let test1 = [
	"Ivo Costa",
	"Akshay Naik",
	"Gaurav borkar",
	"Sunita Naik",
	"Zohaib Mulla",
	"Akshay Anand Naik",
	"akshay naik",
];
let test1_result = {
	sameNames: 1,
	sameFirstName: 3,
	sameMiddleName: 0,
	sameLastName: 4,
};

test(`Sentence with ${test1} should return ${test1_result}`, () => {
	expect(js_t14(test1)).toMatchObject(test1_result);
});

test(`Throws exeption if input doesn't contain required parameter`, () => {
	const args = [null, undefined, NaN, "", 0, false];

	args.forEach((a) => {
		expect(() => {
			js_t14(a);
		}).toThrow();
	});
});
