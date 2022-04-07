const express = require("express");
const tasksControllers = require("../controllers/tasks.controller");

const router = express.Router();

router
	.route("/")
	.get(tasksControllers.getAllTasks)
	.post(tasksControllers.createTask);

router
	.route("/:taskId")
	.get(tasksControllers.getTaskById)
	.patch(tasksControllers.updateTask)
	.delete(tasksControllers.deleteTask);

module.exports = router;
