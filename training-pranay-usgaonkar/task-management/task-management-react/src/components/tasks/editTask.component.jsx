import { useState, useEffect, useRef } from "react";
import {
	FormGroup,
	FormControl,
	InputLabel,
	Input,
	Button,
	makeStyles,
	Typography,
	MenuItem,
	Select,
	FormHelperText,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, editTask } from "../../service/tasks.service";

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

export const EditTask = () => {
	const hasFetchedData = useRef(false);
	const [task, setTask] = useState(initialValue);
	const { title, description, status } = task;
	const { id } = useParams();
	const classes = useStyles();
	let navigate = useNavigate();

	useEffect(() => {
		if (!hasFetchedData.current) {
			getTaskById(id).then((response) => {
				setTask(response.data);
			});
			hasFetchedData.current = true;
		}
	}, [id]);

	const editTaskDetails = async () => {
		await editTask(id, task.status);
		navigate("/task/all/0");
	};

	const onValueChange = (e) => {
		setTask({ ...task, [e.target.name]: e.target.value });
	};

	return (
		<FormGroup className={classes.container}>
			<Typography variant="h4">Set status of the task</Typography>
			<FormControl>
				<InputLabel htmlFor="my-input">Title</InputLabel>
				<Input readOnly name="title" value={title} />
			</FormControl>
			<FormControl>
				<InputLabel htmlFor="my-input">Description</InputLabel>
				<Input readOnly name="description" value={description} />
			</FormControl>
			<FormControl required sx={{ m: 1, minWidth: 120 }}>
				<InputLabel htmlFor="my-input">Status</InputLabel>
				<Select
					labelId="demo-simple-select-required-label"
					id="demo-simple-select-required"
					name="status"
					value={status}
					label="Status *"
					onChange={(e) => onValueChange(e)}
				>
					<MenuItem value="new">new</MenuItem>
					<MenuItem value="in-progress">in-progress</MenuItem>
					<MenuItem value="done">done</MenuItem>
				</Select>
				<FormHelperText>Required</FormHelperText>
			</FormControl>

			<FormControl>
				<Button
					variant="contained"
					color="primary"
					onClick={() => editTaskDetails()}
				>
					Edit Task
				</Button>
			</FormControl>
		</FormGroup>
	);
};
