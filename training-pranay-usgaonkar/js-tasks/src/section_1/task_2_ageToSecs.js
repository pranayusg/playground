/*
------------------------------------
Task 2 : Calculate Age in Seconds
-------------------------------------
Created By: Pranay Usgaonkar
Created Date: 21-Oct-2021
-------------------------------------
*/

function ageToSecs(input) {
	return input > 0 ? input * 365 * 24 * 3600 : 0;
}

// 1 year = 365 days = (365 days) × (24 hours/day) × (3600 seconds/hour) = 31556952 seconds

module.exports = ageToSecs;
