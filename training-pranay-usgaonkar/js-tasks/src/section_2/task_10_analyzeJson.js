/*
------------------------------------
Task 10 : Analyze JSON
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 21-Oct-2021
-------------------------------------
*/

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

function getJsonKeys(input_Json) {
	if (!input_Json) throw new Error("Please provide JSON input");

	return IsJsonString(input_Json)
		? Object.keys(JSON.parse(input_Json))
		: Object.keys(input_Json);
}

module.exports = getJsonKeys;
