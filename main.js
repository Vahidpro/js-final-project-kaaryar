pendingTodosContainer = document.querySelector(".pending-todos-container");
doneTodosContainer = document.querySelector(".done-todos-container");
todoInputEl = document.querySelector(".todo-input");
addButton = document.querySelector(".btn-add");
doneButton = document.querySelector(".btn-done");

// Global Variables
const url = "http://localhost:3010";

// Functions
addNewTaskToDB = async (toTheList, userData) => {
	try {
		await axios.post(`${url}/${toTheList}`, userData);
	} catch (error) {
		throw new Error(error);
	}
};
createTask = (task, isPending) => {
	let container = isPending ? pendingTodosContainer : doneTodosContainer;

	container.innerHTML += `
		<li class="todo-item rounded-4 px-2 m-2 d-flex align-items-center justify-content-between " id="${
			task.id
		}">                   
			<span class="${isPending ? "" : "text-decoration-line-through"}">${
		task.title ? task.title : task
	}</span>
			<div class="icons d-flex">
			${
				isPending
					? '<a href="#" class="btn"><img class="btn-edit" src="./assets/edit-fill.svg" alt="edit-icon"></a>'
					: ""
			}
				<a href="#" class="btn"><img class="btn-delete" src="./assets/delete.svg" alt="delete-icon"></a>
				${
					isPending
						? '<a href="#" class="btn"><img class="btn-done" src="./assets/done.svg" alt="done-icon"></a>'
						: '<a class="btn"><img class="btn-undo" src="./assets/undo.svg" alt="undo-icon"></a>'
				}
			</div>
		</li>`;
};

const getTodoData = async (taskId, listName) => {
	const response = await axios.get(`${url}/${listName}/${taskId}`);
	const data = response.data;
	const userData = { id: data.id, title: data.title };
	return userData;
};

const initialRender = async (listName) => {
	const tasks = await axios.get(`${url}/${listName}`);

	tasks.data.forEach((element) => {
		listName === "todos" ? createTask(element, true) : createTask(element, false);
	});
};

initialRender("todos");
initialRender("dones");

const doneHandlerFunction = async (taskId, e) => {
	const userData = await getTodoData(taskId, "todos");
	addNewTaskToDB("dones", userData);
	createTask(userData, false);
	deleteTodo("todos", taskId, e);
};
const undoHandlerFunction = async (taskId, e) => {
	const userData = await getTodoData(taskId, "dones");
	addNewTaskToDB("todos", userData);
	createTask(userData, true);
	deleteTodo("dones", taskId, e);
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
	createTask(todoInputEl.value, true);
	addNewTaskToDB("todos", { title: todoInputEl.value });
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
		const taskId = e.target.parentElement.parentElement.parentElement.id;
		if (e.target.classList.contains("btn-delete")) {
			deleteTodo("dones", taskId, e);
		} else if (e.target.classList.contains("btn-undo")) {
			undoHandlerFunction(taskId, e);
		}
	});

var deleteTodo = async (listName, taskId, e) => {
	e.preventDefault();
	try {
		await axios.delete(`${url}/${listName}/${taskId}`);
		e.target.parentElement.parentElement.parentElement.remove();
	} catch (error) {
		console.error(error);
	}
};
