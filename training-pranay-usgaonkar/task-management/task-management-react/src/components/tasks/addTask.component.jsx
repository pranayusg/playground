import { useState } from "react";
import {
	FormGroup,
	FormControl,
	InputLabel,
	Input,
	Button,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { addTaskByUserId } from "../../service/users.service";
import { addTask } from "../../service/tasks.service";
import { useNavigate, useParams } from "react-router-dom";

const initialValue = {
	title: "",
	description: "",
	status: "",
};

const useStyles = makeStyles({
	container: {
		width: "50%",
		margin: "5% 0 0 25%",
		"& > *": {
			marginTop: 20,
		},
	},
});

export const AddTask = () => {
	const [task, setTask] = useState(initialValue);
	const { id: userId } = useParams();

	const classes = useStyles();
	let navigate = useNavigate();

	const onValueChange = (e) => {
		setTask({ ...task, [e.target.name]: e.target.value });
	};

	const addTaskDetails = async () => {
		userId !== "0" ? await addTaskByUserId(userId, task) : await addTask(task);
		userId !== "0" ? navigate("/user/all") : navigate("/task/all/0");
	};

	return (
		<FormGroup className={classes.container}>
			<Typography variant="h4">Add Task</Typography>
			<FormControl>
				<InputLabel htmlFor="my-input">Title</InputLabel>
				<Input onChange={(e) => onValueChange(e)} name="title" />
			</FormControl>
			<FormControl>
				<InputLabel htmlFor="my-input">Description</InputLabel>
				<Input onChange={(e) => onValueChange(e)} name="description" />
			</FormControl>
			<FormControl>
				<Button
					variant="contained"
					color="primary"
					onClick={() => addTaskDetails()}
				>
					Add Task
				</Button>
			</FormControl>
		</FormGroup>
	);
};
