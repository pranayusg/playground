/*
------------------------------------
Task 18:  Count vowels
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/
function countVowels(str) {
	var vowels = str.match(/[aeiou]/gi);
	return vowels === null ? 0 : vowels.length;
}

module.exports = countVowels;
