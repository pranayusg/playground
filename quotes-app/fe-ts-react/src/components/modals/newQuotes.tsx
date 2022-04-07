import React, { useContext, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { createQuotes } from "../../apis/protectedRoutes";
import { QuotesContext } from "../../App";
import { formItemLayout } from "../../utils/formHelper";
import TextArea from "antd/lib/input/TextArea";
import { FormOutlined } from "@ant-design/icons";
import { helpers } from "../../utils/generalHelpers";
import { Quote } from "../../interfaces/types";

const swalProps = {
	title: "Are you sure ?",
	icon: "info",
	confirmButtonText: "Yes, add it!",
};

export const NewQuote = () => {
	const contextValue = useContext(QuotesContext);

	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		onReset();
		setIsModalVisible(false);
	};

	const onFinish = async (values: Quote) => {
		let result = await helpers.getConfirmAlert({ ...swalProps });
		if (result.isConfirmed) {
			await createQuotes(values);
			setIsModalVisible(false);
			onReset();
			contextValue.updateTabs();
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
				<FormOutlined />
				&nbsp;New Quote
			</a>
			<Modal
				title="New Quote"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
				width={"40%"}
			>
				<Form
					{...formItemLayout}
					form={form}
					name="control-hooks"
					onFinish={onFinish}
				>
					<Form.Item
						name="quote"
						label="Quote"
						rules={[
							{
								required: true,
							},
						]}
					>
						<TextArea
							placeholder="New Quote"
							autoSize={{ minRows: 3, maxRows: 4 }}
						/>
					</Form.Item>
					<Form.Item
						name="author"
						label="Author"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input placeholder="Author Name" />
					</Form.Item>
					<Form.Item
						name="tags"
						label="Tags"
						rules={[
							{
								required: true,
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value.includes(" ")) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error("Tags shouldn't contain space!")
									);
								},
							}),
						]}
					>
						<Input placeholder="Comma separated tags  eg Motivational,Inspirational" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Create
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
