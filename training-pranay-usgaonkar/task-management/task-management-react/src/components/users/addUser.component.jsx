import { useState } from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import { addUser } from "../../service/users.service";
import { useNavigate } from "react-router-dom";
import "antd/dist/antd.css";

const initialValue = {
	firstName: "",
	lastName: "",
	middleName: "",
	email: "",
	password: "",
	dob: "",
	isAdmin: "false",
};

export const AddUser = () => {
	const [user, setUser] = useState(initialValue);
	const { Option } = Select;
	const { isAdmin } = user;
	let navigate = useNavigate();

	// const onValueChange = (e) => {
	// 	// console.log(e);
	// 	setUser({ ...user, [isAdmin]: e.target.value });
	// };

	const addUserDetails = async () => {
		await addUser(user);
		navigate("/user/all");
	};

	const onFinish = (values) => {
		// console.log("Success:", values);
		setUser(Object.assign(user, values));
		addUserDetails();
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<>
			<h1 style={{ textAlign: "center", margin: 20 }}>Add user</h1>
			<Form
				style={{ marginTop: 70 }}
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item
					label="First Name"
					name="firstName"
					rules={[
						{
							required: true,
							message: "Please input your firstname!",
						},
						{
							type: "string",
							min: 2,
							message: "Should be more then 2 characters",
						},
					]}
				>
					<Input style={{ width: "50%" }} />
				</Form.Item>
				<Form.Item
					label="Last Name"
					name="lastName"
					rules={[
						{
							required: true,
							message: "Please input your lastname!",
						},

						{
							type: "string",
							min: 2,
							message: "Should be more then 2 characters",
						},
					]}
				>
					<Input style={{ width: "50%" }} />
				</Form.Item>
				<Form.Item
					label="Middle Name"
					name="middleName"
					rules={[
						{
							required: true,
							message: "Please input your middlename!",
						},
						{
							type: "string",
							min: 2,
							message: "Should be more then 2 characters",
						},
					]}
				>
					<Input style={{ width: "50%" }} />
				</Form.Item>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your email!",
						},
						{
							type: "email",
						},
					]}
				>
					<Input style={{ width: "50%" }} />
				</Form.Item>
				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Password required!",
						},
						{
							type: "string",
							min: 2,
							message: "Should be more then 2 characters",
						},
					]}
				>
					<Input.Password style={{ width: "50%" }} />
				</Form.Item>

				<Form.Item
					label="DOB"
					name="dob"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
						{
							type: "date",
						},
					]}
				>
					<DatePicker style={{ width: "50%" }} />
				</Form.Item>

				<Form.Item
					label="Is Admin"
					name="isAdmin"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					required
				>
					<Select
						defaultValue="false"
						style={{ width: 200 }}
						name="isAdmin"
						value={isAdmin}
						// onChange={(e) => onValueChange(e)}
					>
						<Option value="true">true</Option>
						<Option value="false">false</Option>
					</Select>
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Add
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};
