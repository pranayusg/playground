const js_t9 = require("./task_9_analyzeString");

let test1 = "It is not enough for code to work.";

test(`Analyze string to its corect output`, () => {
	expect(js_t9(test1)).toMatchObject({
		uniqueCharacters: "sughfcdwk",
		uniqueCharacterCount: 9,
		duplicateCharacters: "itnoer",
		duplicateCharacterCount: 6,
	});
});

let test2 = "Try try but don't cry.";
test(`Analyze string to its corect output`, () => {
	let output = js_t9(test2);

	expect(output).toHaveProperty("uniqueCharacters");
	expect(output).toHaveProperty("uniqueCharacterCount", 6);
	expect(output).toHaveProperty("duplicateCharacters");
	expect(output).toHaveProperty("duplicateCharacterCount", 3);
});
