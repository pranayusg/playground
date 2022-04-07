/*
------------------------------------
Task 7 : Create a deck of Cards
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 22-Oct-2021
-------------------------------------
*/

function getDaySuffix(day) {
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

function getFormatedDate(input_date) {
	if (!input_date) throw new Error("Please provide an  input date");

	let date = input_date.split("-");
	if (!date.length == 3)
		throw new Error("Please provide date in proper format");

	let day = new Date(date[2], date[1], date[0]).getDate();
	let year = new Date(date[2], date[1], date[0]).getFullYear();

	let month = new Date(date[2], date[1] - 1, date[0]).toLocaleString(
		"default",
		{
			month: "short",
		}
	);
	return day + getDaySuffix(day) + " " + month + " " + year;
}

// function getFormatedDate(input_date) {

// 	let day = moment(input_date, "DD-MM-YYYY").format("DD");
// 	let month = moment(input_date, "DD-MM-YYYY").format("MMM");
// 	let year = moment(input_date, "DD-MM-YYYY").format("YYYY");

// 	return day + getDaySuffix(day) + " " + month + " " + year;
// }

// getFormatedDate("20-10-2021");
module.exports = getFormatedDate;
