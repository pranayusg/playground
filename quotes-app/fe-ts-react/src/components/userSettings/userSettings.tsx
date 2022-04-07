import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { getUserDetails, updateUser } from "../../apis/protectedRoutes";
import { formItemLayout } from "../../utils/formHelper";
import { SettingOutlined } from "@ant-design/icons";
import { helpers } from "../../utils/generalHelpers";

interface UserData {
	created_at?: string;
	email?: string;
	id?: string;
	password?: string;
	userName?: string;
}

interface UpdateUser {
	email: string;
	password: string;
	userName: string;
}

const swalProps = {
	title: "Are you sure you want to update your details?",
	icon: "info",
	confirmButtonText: "Yes, update it!",
};

const UserSettings = () => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [userData, setUserData] = useState<UserData>({});

	useEffect(() => {
		fetchInitial();
	}, [isModalVisible]);

	useEffect(() => {
		form.setFieldsValue({
			userName: userData.userName,
			email: userData.email,
		});
	}, [userData, form]);

	const fetchInitial = async () => {
		const userDetails = await getUserDetails();
		setUserData(userDetails);
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onFinish = async (values: UpdateUser) => {
		let result = await helpers.getConfirmAlert({ ...swalProps });
		if (result.isConfirmed) {
			if (values.password === undefined) {
				const { password, ...result } = values;
				await updateUser(result);
			} else {
				await updateUser(values);
			}
			setIsModalVisible(false);
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
				<SettingOutlined />
				Settings
			</a>
			<Modal
				title="User Settings"
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
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name="password" label="Password">
						<Input placeholder="New Password" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Update
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

export default UserSettings;
