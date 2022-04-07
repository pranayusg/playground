/*
------------------------------------
Task 23: EVEN FIBONACCI NUMBERS
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/

function fiboEvenSum(number) {
	let firstTerm = 1,
		secondTerm = 2,
		nextTerm,
		evenSum = 0,
		fiboSeries = [];

	for (let i = 1; i <= number; i++) {
		fiboSeries.push(firstTerm);
		if (firstTerm % 2 == 0) evenSum += firstTerm;

		nextTerm = firstTerm + secondTerm;
		firstTerm = secondTerm;
		secondTerm = nextTerm;
	}
	// console.log(fiboSeries);

	return evenSum;
}

// console.log(fiboEvenSum(5));
