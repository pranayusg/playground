/*
------------------------------------
Task 17 : Check if the given input string is a palindrome or not
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/

const reverseString = require("../section_1/task_4_reverseString");

function isPalindrome(input_str) {
	const str = input_str
		.toLowerCase()
		.trim()
		.replace(/[^0-9A-Z]+/gi, "");

	return str == reverseString(str) ? true : false;
}

module.exports = isPalindrome;
