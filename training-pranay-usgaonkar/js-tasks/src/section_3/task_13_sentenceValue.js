/*
------------------------------------
Task 13 : Sentence Value
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 22-Oct-2021
-------------------------------------
*/
function getSentenceValue(input_str) {
	if (!input_str) throw new Error("Please provide an  input string");

	if (input_str.match(/\d+/g) !== null)
		throw new Error("AlphaNumeric string not accepted");

	let str = input_str.toLowerCase();
	const alphabets = "abcdefghijklmnopqrstuvwxyz";
	let sum = 0;
	let alphabetPos = [];

	for (let i = 0; i < str.length; i++) {
		for (let j = 0; j < alphabets.length; j++) {
			if (str[i] == alphabets[j]) {
				alphabetPos.push(j + 11);
			}
		}
		sum = sum + alphabetPos[i];
	}

	return sum;
}

module.exports = getSentenceValue;
