require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const tasksRoutes = require("./src/routes/tasks.route");

const app = express();

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/tasks", tasksRoutes);

app.get("/", (req, res) => {
	res.send("<h1>Welcome to Tasks Management system</h1>");
});

app.use((error, req, res, next) => {
	res.status(500).json({
		message: error.message,
	});
});

module.exports = app;
