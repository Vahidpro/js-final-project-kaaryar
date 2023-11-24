pendingTodosContainer = document.querySelector(".pending-todos-container");
doneTodosContainer = document.querySelector(".done-todos-container");
todoInputEl = document.querySelector(".todo-input");
addButton = document.querySelector(".add-btn");
doneButton = document.querySelector(".done-btn");

const url = "http://localhost:3010";

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
	<li class="todo-item rounded-4 px-2 m-2 d-flex align-items-center justify-content-between " id="${
		task.id
	}">                   
                            <span class="">${
																													task.title ? task.title : task
																												}</span>
                            <div class="icons d-flex">
							 
                                <a href="#" class="btn "><img class="btn-edit " src="./assets/edit-fill.svg" alt=""></a>
                                <a href="#" class="btn "><img class="btn-delete" src="./assets/delete.svg" alt=""></a>
                                <a href="#" class="btn "><img class="btn-done" src="./assets/done.svg" alt=""></a>
                              
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

const editTodo = async (taskId, e) => {
	const editButton = e.target;
	const taskItem = e.target.closest(".todo-item");
	let taskInput;

	editButton.src = "./assets/round-done.svg";
	editButton.classList.add("btn-edit-done");
	editButton.classList.remove("btn-edit");

	const taskSpan = taskItem.querySelector("span");

	taskInput = document.createElement("input");
	taskInput.classList.add("edit-input");
	taskInput.type = "text";
	taskInput.value = taskSpan?.textContent;

	taskSpan.replaceWith(taskInput);

	taskInput.focus();

	taskInput.addEventListener("keyup", async (e) => {
		if (e.keyCode === 13) {
			await axios.patch(`${url}/todos/${taskId}`, {
				title: taskInput.value,
			});

			editButton.src = "./assets/edit-fill.svg";

			const newSpan = document.createElement("span");
			newSpan.textContent = taskInput.value;
			taskInput.replaceWith(newSpan);

			isEditing = false;
		}
	});
};
const doneEdit = async (taskId, e) => {
	const editButton = e.target;
	editButton.classList.remove("btn-edit-done");
	editButton.classList.add("btn-edit");
	taskInput = document.querySelector(".edit-input");
	console.log(taskId);
	await axios.patch(`${url}/todos/${taskId}`, {
		title: taskInput.value,
	});

	editButton.src = "./assets/edit-fill.svg";

	const newSpan = document.createElement("span");
	newSpan.textContent = taskInput.value;
	taskInput.replaceWith(newSpan);
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
		const taskId = e.target.parentElement.parentElement.parentElement.id;
		if (e.target.classList.contains("btn-delete")) {
			deleteTodo("todos", taskId, e);
		} else if (e.target.classList.contains("btn-done")) {
			doneHandlerFunction(taskId, e);
		} else if (e.target.classList.contains("btn-edit")) {
			editTodo(taskId, e);
		} else if (e.target.classList.contains("btn-edit-done")) {
			doneEdit(taskId, e);
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

var deleteTodo = async (fromList, taskId, e) => {
	e.preventDefault();
	console.log("clicked");
	try {
		console.log(`${url}/${fromList}/${taskId}`);
		await axios.delete(`${url}/${fromList}/${taskId}`);
		e.target.parentElement.parentElement.parentElement.remove();
	} catch (error) {
		console.error(error);
	}
};
