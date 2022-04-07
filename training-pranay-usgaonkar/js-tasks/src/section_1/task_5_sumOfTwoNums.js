/*
------------------------------------
Task 5 : Sum of 2 Numbers
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 21-Oct-2021
-------------------------------------
*/

function getIndices(input, target) {
	let nums = input;

	if (!Array.isArray(input)) nums = input.split(",").map((i) => Number(i));

	if (nums.length < 2) return 0;

	for (let i = 0; i < nums.length; i++) {
		for (let j = i + 1; j < nums.length; j++) {
			if (nums[i] + nums[j] == target) {
				return [i, j];
			}
		}
	}

	return 0;
}

module.exports = getIndices;
