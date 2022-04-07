/*
------------------------------------
Task 16 :Extracting words with "ing" Inflection
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 22-Oct-2021
-------------------------------------
*/
function ingExtractor(str) {
	return str.split(" ").filter((word) => {
		let temp = word.toLowerCase().replace("ing", "");
		if (temp.length === temp.replace(/[aeiou]/g, "").length) {
			return false;
		}
		if (word.toLowerCase().includes("ing")) {
			return true;
		}
	});
}
