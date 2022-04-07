/*
------------------------------------
Task 16 :Largest Palindrome Product
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 22-Oct-2021
-------------------------------------
*/
function getLargestPallindrome() {
	let largest = 0;

	for (let i = 100; i <= 999; i++) {
		for (let j = 100; j <= 999; j++) {
			if (i * j == opposite(i * j) && i * j > largest) largest = i * j;
		}
	}

	return largest;
}

function opposite(num) {
	let n = num.toString();
	let m = "";

	for (let i = n.length - 1; i >= 0; i--) {
		m += n[i];
	}

	return Number(m);
}

module.exports = getLargestPallindrome;
