import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { register } from "../../apis/openRoutes";
import { formItemLayout } from "../../utils/formHelper";
import { UserAddOutlined } from "@ant-design/icons";
import { helpers } from "../../utils/generalHelpers";
import { Register } from "../../interfaces/types";

const swalProps = {
	title: "Are you sure with the registration details ?",
	icon: "info",
	confirmButtonText: "Yes, Register me!",
};

const SignUp = () => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onFinish = async (values: Register) => {
		let result = await helpers.getConfirmAlert({ ...swalProps });
		if (result.isConfirmed) {
			await register(values);
			setIsModalVisible(false);
			onReset();
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
				<UserAddOutlined />
				Sign up
			</a>
			<Modal
				title="Sign Up"
				visible={isModalVisible}
				onOk={handleOk}
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
						name="userName"
						label="Username"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{
								required: true,
							},
							{
								type: "email",
								message: "The input is not valid E-mail!",
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
							({ getFieldValue }) => ({
								validator(_, value) {
									if (value.length > 2) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error("Password must be greater then two characters!")
									);
								},
							}),
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="confirmPassword"
						label="Confirm Password"
						rules={[
							{
								required: true,
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error(
											"The two passwords that you entered do not match!"
										)
									);
								},
							}),
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item>
						<Button style={{ float: "right" }} type="primary" htmlType="submit">
							Register
						</Button>
						<Button
							style={{ float: "right" }}
							htmlType="button"
							onClick={onReset}
						>
							Reset
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default SignUp;
