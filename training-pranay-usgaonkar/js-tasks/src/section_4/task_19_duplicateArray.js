/*
------------------------------------
Task 18:  DUPLICATES IN AN ARRAY
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 25-Oct-2021
-------------------------------------
*/
function getDuplicates(input_array) {
	let arr = input_array;
	if (!Array.isArray(input_array)) arr = input_array.split(",");

	let duplicate_arr = [];
	let unique_arr = [];

	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[i] == arr[j] && !duplicate_arr.includes(arr[i])) {
				duplicate_arr.push(arr[i]);
			}
		}

		if (!duplicate_arr.includes(arr[i])) unique_arr.push(arr[i]);
	}

	return [...duplicate_arr, ...unique_arr];
}

module.exports = getDuplicates;
