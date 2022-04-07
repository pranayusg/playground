import { AllUsers } from "./components/users/allUsers.component";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AddUser } from "./components/users/addUser.component";
import { EditUser } from "./components/users/editUser.component";
import { NotFound } from "./components/notFound.component";
// import { NavBar } from "./components/navBar.component";
import { AllTasks } from "./components/tasks/allTasks.component";
import { AddTask } from "./components/tasks/addTask.component";
import { EditTask } from "./components/tasks/editTask.component";
import { Login } from "./components/auth/login.component";

function App() {
	return (
		<BrowserRouter>
			{/* <NavBar /> */}
			<Routes>
				<Route exact path="/" element={<Login />} />
				<Route exact path="/user/all" element={<AllUsers />} />
				<Route exact path="/user/add" element={<AddUser />} />
				<Route exact path="/user/edit/:id" element={<EditUser />} />
				<Route exact path="/task/all/:id" element={<AllTasks />} />
				<Route exact path="/task/add/:id" element={<AddTask />} />
				{/* <Route exact path="/task/add" element={<AddTask isAdmin={false} />} /> */}
				<Route exact path="/task/edit/:id" element={<EditTask />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
