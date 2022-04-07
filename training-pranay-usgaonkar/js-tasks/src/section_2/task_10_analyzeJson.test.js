const js_t10 = require("./task_10_analyzeJson");

let test1 = {
	name: "keith",
	age: 20,
	mobile: "9876543210",
};

test(`Should return JSON keys for valid JSON`, () => {
	expect(js_t10(test1)).toMatchObject(["name", "age", "mobile"]);
});

let test2 = JSON.stringify({
	title: "Harry Potter and the Goblet of Fire",
	author: "J.k. Rowling",
});

test(`Should return JSON keys for JSON passed as strings`, () => {
	expect(js_t10(test2)).toMatchObject(["title", "author"]);
});
