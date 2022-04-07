import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { editQuote } from "../../apis/protectedRoutes";
import { helpers } from "../../utils/generalHelpers";

const swalProps = {
	title: "Are you sure you want to Edit?",
	icon: "info",
	confirmButtonText: "Yes, edit it!",
};

export const EditModal = (props) => {
	const [form] = Form.useForm();

	const handleOk = () => {
		props.handleEditModalCancel();
	};

	const handleCancel = () => {
		props.handleEditModalCancel();
	};

	const onFinish = async (values) => {
		let result = await helpers.getConfirmAlert({ ...swalProps });
		if (result.isConfirmed) {
			await editQuote(values);
			props.handleEditModalCancel();
		}
	};

	const onReset = () => {
		form.resetFields();
	};

	useEffect(() => {
		form.setFieldsValue({
			id: props.data.id,
			quote: props.data.quote,
			author: props.data.author,
		});
	});

	return (
		<>
			<Modal
				title="Edit Quote"
				visible={props.isEditModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
				width={"50%"}
			>
				<Form form={form} name="control-hooks" onFinish={onFinish}>
					<Form.Item name="id" style={{ display: "none" }}></Form.Item>
					<Form.Item
						name="quote"
						label="Quote"
						rules={[
							{
								required: true,
							},
						]}
					>
						<TextArea autoSize />
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
						<Input />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Submit
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
