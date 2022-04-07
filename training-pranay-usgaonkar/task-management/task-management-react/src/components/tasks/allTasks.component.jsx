import { useState, useEffect, useRef } from "react";
import { Table, Space, Button } from "antd";
import { getTasks, deleteTask } from "../../service/tasks.service";
import { getTasksByUserId } from "../../service/users.service";
import { useParams, useNavigate } from "react-router-dom";
import "antd/dist/antd.css";
import { logout } from "../../service/auth.service";

export const AllTasks = () => {
	const hasFetchedData = useRef(false);
	const [tasks, setTasks] = useState([]);
	const { id: userId } = useParams();

	let navigate = useNavigate();
	useEffect(() => {
		if (!hasFetchedData.current) {
			if (userId !== "0") {
				getTasksByUserId(userId).then((response) => {
					setTasks(response.data);
				});
			} else {
				getTasks().then((response) => {
					setTasks(response.data);
				});
			}
			hasFetchedData.current = true;
		}
	}, [userId]);

	const deleteUserData = async (id) => {
		await deleteTask(id);
		getAllTasks();
	};
	const getAllTasks = async () => {
		let response = await getTasks();
		setTasks(response.data);
	};

	function goToAddTask() {
		navigate("/task/add/0");
	}

	function logoutUser() {
		logout();
		navigate("/");
	}

	function goback() {
		navigate("/user/all");
	}

	const columns = [
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Action",
			key: "action",
			hidden: userId !== "0" ? true : false,
			render: (text, record) => (
				// console.log(record),
				<Space size="middle">
					<a href={`/task/edit/${record.id}`}>Edit </a>
					<Button type="link" danger onClick={() => deleteUserData(record.id)}>
						Delete
					</Button>
				</Space>
			),
		},
	].filter((item) => !item.hidden);

	tasks.map((task) => (task.key = task.id));
	return (
		<>
			{/* <Row justify="space-around" align="bottom">
				<Col span={5}> */}
			{userId=="0" && <Button style={{ margin: 40 }} onClick={goToAddTask} type="primary">
				Add task
			</Button>}

			{userId !=="0" &&<Button style={userId=="0" ? { marginLeft: 10 }:{ marginLeft: 40,marginTop: 35 }} onClick={goback} type="primary">
				Back
			</Button>}
			{/* </Col>
				<Col span={5}> */}
			<Button style={userId=="0" ? { marginLeft: 10 }:{ marginLeft: 40,marginTop: 35 }} onClick={logoutUser} type="primary">
				Log out
			</Button>
			{/* </Col>
			</Row> */}
			<Table style={{ margin: 40 }} columns={columns} dataSource={tasks} />)
		</>
	);
};
