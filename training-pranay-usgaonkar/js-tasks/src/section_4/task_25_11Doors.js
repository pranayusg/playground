/*
------------------------------------
Task 23: EVEN FIBONACCI NUMBERS
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/

function getOPenDoors() {
	let door = [101];
	let doorNo = [];

	for (let i = 1; i <= 100; i++) {
		door[i] = checkEvenOdd(i);
		// 1 closed
		// 2 open

		if (door[i] == 2) doorNo.push(i);
	}

	return doorNo;
}

function checkEvenOdd(a) {
	let count = 0,
		k;
	for (k = 2; k <= a; k++) {
		if (a % k == 0) count++;
	}

	if (count % 2 == 0) return 2;

	return 1;
}

// console.log(getOPenDoors(5));
