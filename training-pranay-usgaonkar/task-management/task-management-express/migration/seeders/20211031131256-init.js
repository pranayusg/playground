"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"Tasks",
			[
				{
					title: "JS tasks 1",
					description: "Competitive JS tasks",
					status: "done",
				},
				{
					title: "JS tasks 2",
					description: "Competitive JS tasks",
					status: "done",
				},
				{
					title: "Unit tests for JS tasks 1",
					description: "Writing unit tests using Jest",
					status: "done",
				},
				{
					title: "Unit tests for JS tasks 2",
					description: "Writing unit tests using Jest",
					status: "in-progress",
				},
				{
					title: "Unit tests for JS tasks 3",
					description: "Writing unit tests using Jest",
					status: "in-progress",
				},
				{
					title: "JS tasks 3",
					description: "Competitive JS tasks",
					status: "in-progress",
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Tasks", null, {});
	},
};
