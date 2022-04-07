const { DataTypes } = require("sequelize");
const sequelize = require("./connection");

const methods = {};

const tasksDataModel = sequelize.define(
	`Tasks`,
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		title: { type: DataTypes.STRING },
		description: DataTypes.STRING,
		status: DataTypes.STRING,
	},
	{
		schema: "public",
		timestamps: false,
	}
);

methods.findAllTasks = function () {
	return new Promise((resolve, reject) => {
		tasksDataModel
			.findAll()
			.then((results) => {
				resolve(results);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

methods.findTaskById = function (id) {
	return new Promise((resolve, reject) => {
		tasksDataModel
			.findByPk(id)
			.then((results) => {
				resolve(results);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

methods.saveTask = function (task) {
	console.log(task);
	return new Promise((resolve, reject) => {
		tasksDataModel
			.create(task)
			.then((savedObj) => {
				resolve(savedObj.dataValues);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

methods.findByIdAndUpdate = function (id, task) {
	return new Promise((resolve, reject) => {
		tasksDataModel
			.update({ status: task.status }, { where: { id } })
			.then((count) => {
				resolve(count[0]);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

methods.removeById = function (id) {
	return new Promise((resolve, reject) => {
		tasksDataModel
			.destroy({ where: { id } })
			.then((count) => {
				resolve(count);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

module.exports = methods;
