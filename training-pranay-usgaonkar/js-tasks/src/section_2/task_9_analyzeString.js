/*
------------------------------------
Task 9: Analyze String
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 21-Oct-2021
-------------------------------------
*/

function getAnalyzedString(input_str) {
	if (!input_str) throw new Error("Input string is required");

	input_str = input_str
		.toLowerCase()
		.trim()
		.replace(/ /g, "")
		.replace(/[^0-9A-Z]+/gi, "")
		.split("");

	let unique_arr = [];
	let duplicate_arr = [];

	for (let i = 0; i < input_str.length; i++) {
		for (let j = i + 1; j < input_str.length; j++) {
			if (
				input_str[i] == input_str[j] &&
				!duplicate_arr.includes(input_str[i])
			) {
				duplicate_arr.push(input_str[i]);
			}
		}

		if (!duplicate_arr.includes(input_str[i])) unique_arr.push(input_str[i]);
	}

	return {
		uniqueCharacters: unique_arr.join(""),
		uniqueCharacterCount: unique_arr.join("").length,
		duplicateCharacters: duplicate_arr.join(""),
		duplicateCharacterCount: duplicate_arr.join("").length,
	};
}

module.exports = getAnalyzedString;
