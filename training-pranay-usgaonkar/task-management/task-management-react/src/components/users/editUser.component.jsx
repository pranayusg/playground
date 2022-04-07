import { useState, useEffect, useRef } from "react";
import {
	FormGroup,
	FormControl,
	InputLabel,
	Input,
	Button,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, editUser } from "../../service/users.service";

const initialValue = {
	firstName: "",
	lastName: "",
	middleName: "",
	email: "",
	dob: "",
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

export const EditUser = () => {
	const hasFetchedData = useRef(false);
	const [user, setUser] = useState(initialValue);
	const { firstName, lastName, middleName, email, dob } = user;
	const { id } = useParams();
	const classes = useStyles();
	let navigate = useNavigate();

	useEffect(() => {
		if (!hasFetchedData.current) {
			getUserById(id).then((response) => {
				setUser(response.data);
			});
			hasFetchedData.current = true;
		}
	}, [id]);

	const editUserDetails = async () => {
		await editUser(id, user);
		navigate("/user/all");
	};

	const onValueChange = (e) => {
		console.log();
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	return (
		<FormGroup className={classes.container}>
			<Typography variant="h4">Edit Information</Typography>
			<FormControl>
				<InputLabel htmlFor="my-input">First Name</InputLabel>
				<Input
					onChange={(e) => onValueChange(e)}
					name="firstName"
					value={firstName}
					id="my-input"
					aria-describedby="my-helper-text"
				/>
			</FormControl>
			<FormControl>
				<InputLabel htmlFor="my-input">Last Name</InputLabel>
				<Input
					onChange={(e) => onValueChange(e)}
					name="lastName"
					value={lastName}
				/>
			</FormControl>
			<FormControl>
				<InputLabel htmlFor="my-input">Middle Name</InputLabel>
				<Input
					onChange={(e) => onValueChange(e)}
					name="middleName"
					value={middleName}
				/>
			</FormControl>
			<FormControl>
				<InputLabel htmlFor="my-input">Email</InputLabel>
				<Input onChange={(e) => onValueChange(e)} name="email" value={email} />
			</FormControl>
			<FormControl>
				<InputLabel htmlFor="my-input">DOB</InputLabel>
				<Input onChange={(e) => onValueChange(e)} name="dob" value={dob} />
			</FormControl>
			<FormControl>
				<Button
					variant="contained"
					color="primary"
					onClick={() => editUserDetails()}
				>
					Edit User
				</Button>
			</FormControl>
		</FormGroup>
	);
};
