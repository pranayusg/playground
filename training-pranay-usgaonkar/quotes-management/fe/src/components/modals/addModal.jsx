import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { createQuotes } from "../../apis/service";

export const AddModal = (props) => {
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

  const onFinish = async (values) => {
    await createQuotes(values);
    props.test();
    setIsModalVisible(false);
    onReset();
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Button
        style={{ margin: 20, marginLeft: "3%" }}
        type="primary"
        onClick={showModal}
      >
        Create Quote
      </Button>
      <Modal
        title="Add Quote"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="quote"
            label="Quote"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
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
