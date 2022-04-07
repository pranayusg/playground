/*
------------------------------------
Task 6 : Number exists in array
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 21-Oct-2021
-------------------------------------
*/

function checkIfNoExistsInArray(input_array1, input_array2, input_number) {
	if (!input_array1 || !input_array2 || !input_number)
		throw new Error("Please provide two arrays and number to compare");

	let nums1 = input_array1;
	let nums2 = input_array2;

	if (!Array.isArray(input_array1))
		nums1 = input_array1.split(",").map((i) => Number(i));
	if (!Array.isArray(input_array2))
		nums2 = input_array2.split(",").map((i) => Number(i));

	let key1 = 0,
		key2 = 0;

	for (let i = 0; i < nums1.length; i++) {
		if (input_array1 !== "" && nums1[i] == input_number) key1 = 1;
	}

	for (let i = 0; i < nums2.length; i++) {
		if (input_array2 !== "" && nums2[i] == input_number) key2 = 1;
	}

	if (key1 == 1 && key2 == 1)
		return "number " + input_number + " found in both arrays";
	else if (key1 == 1 && key2 == 0)
		return "number " + input_number + " found in array_one";
	else if (key1 == 0 && key2 == 1)
		return "number " + input_number + " found in array_two";
	else return "number " + input_number + " doesn't exist in both arrays";
}

module.exports = checkIfNoExistsInArray;
