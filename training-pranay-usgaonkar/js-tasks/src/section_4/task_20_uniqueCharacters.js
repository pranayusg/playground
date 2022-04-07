/*
------------------------------------
Task 20:  UNIQUE CHARACTERS IN A GIVEN SENTENCE
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/

function getUniqueCharacters(input_str) {
	const str = input_str.replace(/ /g, "").toLowerCase().trim().split("");
	let duplicate_arr = [];
	let unique_arr = [];

	for (let i = 0; i < str.length; i++) {
		for (let j = i + 1; j < str.length; j++) {
			if (str[i] == str[j] && !duplicate_arr.includes(str[i])) {
				duplicate_arr.push(str[i]);
			}
		}

		if (!duplicate_arr.includes(str[i])) unique_arr.push(str[i]);
	}

	return {
		uniqueCharacters: unique_arr.join(""),
		uniqueCharacterCount: unique_arr.length,
	};
}

// console.log(getUniqueCharacters("Hello bro"));

module.exports = getUniqueCharacters;
