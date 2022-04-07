import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Layout } from "antd";
import { login } from "../../service/auth.service";
import "antd/dist/antd.css";

export const Login = () => {
	const [isWrongCredentials, setIsWrongCredentials] = useState(false);
	let navigate = useNavigate();

	const onFinish = (values) => {
		// console.log("Success:", values);
		setJwt(values);
	};

	const onFinishFailed = (errorInfo) => {
		// console.log("Failed:", errorInfo);
	};

	const setJwt = async (values) => {
		const response = await login(values);

		if (response) {
			localStorage.setItem(
				"Authorization",
				"Bearer " + response.data.access_token
			);

			console.log(response);
			response.data.isAdmin ? navigate("/user/all") : navigate("/task/all/0");
		} else {
			setIsWrongCredentials(true);
		}
	};

	return (
		<>
			<Layout.Content style={{ height: "50%" }}>
				{isWrongCredentials ? (
					<Alert
						message="Invalid credentials"
						// description={fatalError.stack}
						type="error"
					/>
				) : null}
			</Layout.Content>

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
					label="Email"
					name="username"
					rules={[
						{
							required: true,
							message: "Please input your email!",
						},
					]}
				>
					{/* <Input.Group size="default">
						<Row gutter={8}>
							<Col span={12}> */}
					<Input style={{ width: "50%" }} />
					{/* </Col>
						</Row>
					</Input.Group> */}
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}
				>
					{/* <Input.Group size="default">
						<Row gutter={8}>
							<Col span={12}> */}
					<Input.Password style={{ width: "50%" }} />
					{/* </Col>
						</Row>
					</Input.Group> */}
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Log in
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};
