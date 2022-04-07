/*
------------------------------------
Task 16 :Extracting words with "ing" Inflection
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 22-Oct-2021
-------------------------------------
*/
function getAnalyzedStudentNames(input_names) {
	if (!input_names) throw new Error("Please provide an array of names");

	let names;
	if (!Array.isArray(input_names))
		names = input_names.split(",").map((value) => value.trim().toLowerCase());
	else names = input_names.map((value) => value.trim().toLowerCase());

	let firstName = [],
		middleName = [],
		lastName = [];

	names.map((fullName) => {
		let splitedNames = fullName.split(" ");
		if (splitedNames.length == 3) {
			firstName.push(splitedNames[0]);
			middleName.push(splitedNames[1]);
			lastName.push(splitedNames[2]);
		} else if (splitedNames.length == 2) {
			firstName.push(splitedNames[0]);
			lastName.push(splitedNames[1]);
		} else {
			firstName.push(splitedNames[0]);
		}
	});

	let duplicateNamesCount = compareNames(names);
	let firstNameCount = compareNames(firstName);
	let middleNameCount = compareNames(middleName);
	let lastNameCount = compareNames(lastName);

	// console.log({
	// 	sameNames: duplicateNamesCount,
	// 	sameFirstName: firstNameCount > 0 ? ++firstNameCount : 0,
	// 	sameMiddleName: middleNameCount > 0 ? ++middleNameCount : 0,
	// 	sameLastName: lastNameCount > 0 ? ++lastNameCount : 0,
	// });
	return {
		sameNames: duplicateNamesCount,
		sameFirstName: firstNameCount > 0 ? ++firstNameCount : 0,
		sameMiddleName: middleNameCount > 0 ? ++middleNameCount : 0,
		sameLastName: lastNameCount > 0 ? ++lastNameCount : 0,
	};
}

function compareNames(names) {
	let counter = 0;
	for (let i = 0; i < names.length; i++) {
		for (let j = i + 1; j < names.length; j++) {
			if (names[i] == names[j]) {
				counter++;
				break;
			}
		}
	}

	return counter;
}

// console.log(
// 	getAnalyzedStudentNames(
// 		"Ivo Costa, Akshay Naik, Gaurav borkar, Sunita Naik, Zohaib Mulla, Akshay Anand Naik, akshay naik"
// 	)
// );

// console.log(
// 	getAnalyzedStudentNames([
// 		"Ivo Costa",
// 		"Akshay Naik",
// 		"Gaurav borkar",
// 		"Sunita Naik",
// 		"Zohaib Mulla",
// 		"Akshay Anand Naik",
// 		"akshay naik",
// 	])
// );

module.exports = getAnalyzedStudentNames;
