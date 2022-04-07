import { useState, useEffect } from "react";
import { Table, Space, Button } from "antd";
import { getUsers, deleteUser } from "../../service/users.service";
import "antd/dist/antd.css";
import { logout } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

export const AllUsers = () => {
	const [users, setUsers] = useState([]);
	let navigate = useNavigate();

	useEffect(() => {
		getAllUsers();
	}, []);

	const deleteUserData = async (id) => {
		await deleteUser(id);
		getAllUsers();
	};

	const getAllUsers = async () => {
		let response = await getUsers();
		setUsers(response.data);
	};

	function goToAddUser() {
		navigate("/user/add");
	}

	function logoutUser() {
		logout();
		navigate("/");
	}

	const columns = [
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName",
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName",
		},
		{
			title: "Middle Name",
			dataIndex: "middleName",
			key: "middleName",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "DOB",
			dataIndex: "dob",
			key: "dob",
		},
		{
			title: "Admin",
			dataIndex: "isAdmin",
			key: "isAdmin",
			render: (text) => String(text),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Space size="middle">
					<a href={`/user/edit/${record.id}`}>Edit </a>
					<Button type="link" danger onClick={() => deleteUserData(record.id)}>
						Delete
					</Button>
					<a href={`/task/add/${record.id}`}>Add Task </a>
					<a href={`/task/all/${record.id}`}>View Tasks </a>
				</Space>
			),
		},
	];

	users.map((user) => (user.key = user.id));
	return (
		<>
			{/* <Row justify="space-around" align="bottom">
				<Col span={5}> */}
			<Button style={{ margin: 40 }} onClick={goToAddUser} type="primary">
				Add user
			</Button>
			{/* </Col>
				<Col span={5}> */}
			<Button style={{ marginLeft: 10 }} onClick={logoutUser} type="primary">
				Log out
			</Button>
			{/* </Col>
			</Row> */}
			<Table style={{ margin: 40 }} columns={columns} dataSource={users} />)
		</>
	);
};
