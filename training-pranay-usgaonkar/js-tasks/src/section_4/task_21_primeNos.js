/*
------------------------------------
Task 21: GET THE 1ST N PRIME NUMBERS
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/

function getPrimeNumbers(n) {
	let counter = 2;
	let primeNums = [];

	while (primeNums.length < n) {
		if (isPrime(counter)) {
			primeNums.push(counter);
		}
		counter++;
	}

	return primeNums;
}

function isPrime(n) {
	for (let i = 2; i <= n / 2; i++) {
		if (n % i === 0) {
			return false;
		}
	}
	return true;
}

// console.log(getPrimeNumbers(1));
