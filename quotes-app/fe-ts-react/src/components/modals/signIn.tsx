import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { login } from "../../apis/openRoutes";
import { auth } from "../../utils/authHelpers";
import { formItemLayout } from "../../utils/formHelper";
import { LoginOutlined } from "@ant-design/icons";
import { Credentials } from "../../interfaces/types";
import { helpers } from "../../utils/generalHelpers";

interface SignInProps {
	setLogIn: () => void;
}

const swalProps = {
	title: "Invalid Credentials!!",
	icon: "error",
};

const SignIn = (props: SignInProps) => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		onReset();
		setIsModalVisible(false);
	};

	const onFinish = async (values: Credentials) => {
		const userData = await login(values);
		if (userData.username) {
			auth.setAuthValues(userData);
			setIsModalVisible(false);
			onReset();

			if (auth.isLoggedIn()) {
				props.setLogIn();
			}
		} else {
			await helpers.getInvalidLoginAlert({ ...swalProps });
		}
	};

	const onReset = () => {
		form.resetFields();
	};

	return (
		<>
			<a
				style={{ margin: 20, marginLeft: "3%" }}
				type="primary"
				onClick={showModal}
			>
				<LoginOutlined />
				Sign in
			</a>
			<Modal
				title="Sign In"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				<Form
					{...formItemLayout}
					form={form}
					name="control-hooks"
					onFinish={onFinish}
				>
					<Form.Item
						name="username"
						label="Email"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="password"
						label="Password"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Sign In
						</Button>
						<Button htmlType="button" onClick={onReset}>
							Reset
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default SignIn;
