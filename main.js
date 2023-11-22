pendingTodosContainer = document.querySelector(".pending-todos-container");
doneTodosContainer = document.querySelector(".done-todos-container");
todoInputEl = document.querySelector(".todo-input");
addButton = document.querySelector(".add-btn");
doneButton = document.querySelector(".done-btn");

// Functions
addTaskToDB = async (toList, userData) => {
	try {
		await axios.post(`${url}/${toList}`, userData);
	} catch (error) {
		console.log(error);
	}
};
createPendingTask = (task) => {
	pendingTodosContainer.innerHTML += `
	<li class="todo-item rounded-4 px-2 m-2 " id="${task.id}">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="">${
																													task.title ? task.title : task
																												}</span>
                            <div class="icons">
							 
                                <a href="#" class="btn "><img class="btn-edit " src="./assets/edit-fill.svg" alt=""></a>
                                <a href="#" class="btn "><img class="btn-delete" src="./assets/delete.svg" alt=""></a>
                                <a href="#" class="btn "><img class="btn-done" src="./assets/done.svg" alt=""></a>
                              
                            </div>
                        </div>
                    </li>
	`;
};
createDoneTask = (task) => {
	doneTodosContainer.innerHTML += `
                    <li class="todo-item rounded-4 px-2 m-2" id="${task.id}">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class=" text-decoration-line-through">${task.title}</span>
                            <div class="icons">
                                <a class="btn "><img class="btn-delete" src="./assets/delete.svg" alt=""></a>
                                <a class="btn "><img class="btn-undo" src="./assets/undo.svg" alt=""></a>
                            </div>
                        </div>
                    </li>
	`;
};

const getTodoData = async (taskId, fromList) => {
	const response = await axios.get(`${url}/${fromList}/${taskId}`);
	const data = response.data;
	const userData = { id: data.id, title: data.title };
	return userData;
};

const url = "http://localhost:3000";

const initialRender = async () => {
	const pendingTasks = await axios.get(url + "/todos");
	pendingTasks.data.forEach((element) => {
		createPendingTask(element);
	});

	const doneTasks = await axios.get(url + "/dones");
	doneTasks.data.forEach((element) => {
		createDoneTask(element);
	});
};

initialRender();

const doneHandlerFunction = async (taskId, e) => {
	const userData = await getTodoData(taskId, "todos");
	addTaskToDB("dones", userData);
	createDoneTask(userData);
	deleteTodo(taskId, "todos", e);
};
const undoHandlerFunction = async (taskId, e) => {
	const userData = await getTodoData(taskId, "dones");
	addTaskToDB("todos", userData);
	createPendingTask(userData);
	deleteTodo(taskId, "dones", e);
};

todoInputEl.addEventListener("input", (e) => {
	if (todoInputEl.value.trim() == "") {
		addButton.disabled = true;
	} else {
		addButton.disabled = false;
	}
});

addButton.addEventListener("click", (e) => {
	e.preventDefault();
	createPendingTask(todoInputEl.value);
	addTaskToDB("todos", { title: todoInputEl.value });
});

document
	.querySelector(".pending-todos-container")
	.addEventListener("click", (e) => {
		e.preventDefault();
		const taskId =
			e.target.parentElement.parentElement.parentElement.parentElement.id;
		if (e.target.classList.contains("btn-delete")) {
			deleteTodo(taskId, "todos", e);
		} else if (e.target.classList.contains("btn-done")) {
			doneHandlerFunction(taskId, e);
		}
	});

document
	.querySelector(".done-todos-container")
	.addEventListener("click", (e) => {
		e.preventDefault();
		const taskId =
			e.target.parentElement.parentElement.parentElement.parentElement.id;
		console.log(taskId);
		if (e.target.classList.contains("btn-delete")) {
			deleteTodo(taskId, "dones", e);
		} else if (e.target.classList.contains("btn-undo")) {
			undoHandlerFunction(taskId, e);
		}
	});

var deleteTodo = async (taskId, fromList, e) => {
	e.preventDefault();
	try {
		await axios.delete(`${url}/${fromList}/${taskId}`);
		e.target.parentElement.parentElement.parentElement.remove();
	} catch (error) {
		console.error(error);
	}
};
