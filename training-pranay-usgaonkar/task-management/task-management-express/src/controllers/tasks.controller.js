const tasksModel = require("../models/tasks.model");

const getAllTasks = (req, res) => {
	tasksModel
		.findAllTasks()
		.then((tasks) => {
			res.status(200).json(tasks);
		})
		.catch((err) => {
			res.status(500).json({
				message: "Unable to retrieve tasks",
				err,
			});
		});
};

const getTaskById = (req, res) => {
	if (!req.params.taskId) {
		res.status(400).send("Please specify TaskId to update task");
	}

	tasksModel
		.findTaskById(req.params.taskId)
		.then((tasks) => {
			res.status(200).json(tasks);
		})
		.catch((err) => {
			res.status(500).json({
				message: "Unable to retrieve tasks",
				err,
			});
		});
};

const createTask = (req, res) => {
	if (Object.keys(req.body).length !== 3) {
		res.status(400).send("Please specify all the task details");
	}

	tasksModel
		.saveTask(req.body)
		.then((savedTask) => {
			res.status(201).json({
				message: "Task Saved",
				taskDetails: savedTask,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: "Unable to save task ",
				err,
			});
		});
};

const updateTask = (req, res) => {
	if (!req.params.taskId) {
		res.status(400).send("Please specify TaskId to update task");
	}

	tasksModel
		.findByIdAndUpdate(req.params.taskId, req.body)
		.then((count) => {
			console.log(count);
			if (!count) {
				return res
					.status(404)
					.send({ message: "No Task to update or Price is same" });
			}

			tasksModel
				.findTaskById(req.params.taskId)
				.then((tasks) => {
					res.status(200).json({ message: "Task Updated", taskDetails: tasks });
				})
				.catch((err) => {
					res.status(500).json({
						message: "Unable to retrieve tasks",
						err,
					});
				});
		})
		.catch((err) => {
			res.status(500).json({
				message: "Unable to update tasks",
				err,
			});
		});
};

const deleteTask = (req, res) => {
	if (!req.params.taskId) {
		res.status(400).send("Please specify TaskId to delete tasks");
	}

	tasksModel
		.removeById(req.params.taskId)
		.then((count) => {
			if (!count) {
				return res.status(404).send({ message: "No Task to delete" });
			}

			res.status(200).json({
				message: "Task Deleted",
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: "Unable to delete tasks",
				error: err,
			});
		});
};

module.exports = {
	getAllTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
};
