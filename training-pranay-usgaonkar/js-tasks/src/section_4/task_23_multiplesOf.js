/*
------------------------------------
Task 23: MULTIPLES OF 3 AND 5
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/

function multipleOf3and5(number) {
	let sum = 0;
	let multiplesOf3 = [];
	let multiplesOf5 = [];

	for (let i = 1; i < number / 2; i++) {
		if (i * 3 < number) {
			multiplesOf3.push(i * 3);
		}
		if (i * 5 < number) {
			multiplesOf5.push(i * 5);
		}
	}
	const combined = [...multiplesOf3, ...multiplesOf5];

	for (let i = 0; i < combined.length; i++) {
		sum += combined[i];
	}
	return sum;
}

// console.log(multipleOf3and5(10));
