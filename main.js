todoTasksContainer = document.querySelector(".todo-tasks-container");
doneTasksContainer = document.querySelector(".done-tasks-container");
taskInput = document.querySelector(".todo-input");
addButton = document.querySelector(".btn-add");
doneButton = document.querySelector(".btn-done");

// Global Variables
const url = "http://localhost:3000";
let nextId;

// Functions
addNewTaskToDB = async (toTheList, userData) => {
	try {
		await axios.post(`${url}/${toTheList}`, userData);
	} catch (error) {
		throw new Error(error);
	}
};

const getNextId = async () => {
	try {
		const todoTasks = await axios.get(`${url}/todoTasksList`);
		const doneTasks = await axios.get(`${url}/doneTasksList`);

		const todoIds = todoTasks.data.map((task) => task.id);
		const doneIds = doneTasks.data.map((task) => task.id);

		const allIds = [...todoIds, ...doneIds];
		nextId = Math.max(...allIds) + 1;
	} catch (error) {
		throw new Error(error);
	}
};

getNextId();

createTask = (task, isInTodoList) => {
	if (task.id) {
		id = task.id;
	} else {
		id = nextId;
	}

	let container = isInTodoList ? todoTasksContainer : doneTasksContainer;

	container.innerHTML += `
		<li class="todo-item rounded-4 px-2 m-2 d-flex align-items-center justify-content-between " id="${id}">                   
			<span class="${isInTodoList ? "" : "text-decoration-line-through"}">${
		task.title ? task.title : task
	}</span>
			<div class="icons d-flex">
			${
				isInTodoList
					? '<a href="#" class="btn"><img class="btn-edit" src="./assets/edit-fill.svg" alt="edit-icon"></a>'
					: ""
			}
				<a href="#" class="btn"><img class="btn-delete${
					isInTodoList ? "-todo" : "-done"
				}" src="./assets/delete.svg" alt="delete-icon"></a>
				${
					isInTodoList
						? '<a href="#" class="btn"><img class="btn-done" src="./assets/done.svg" alt="done-icon"></a>'
						: '<a class="btn"><img class="btn-undo" src="./assets/undo.svg" alt="undo-icon"></a>'
				}
			</div>
		</li>`;
};

const deleteTask = async (listName, taskId, e) => {
	e.preventDefault();
	try {
		await axios.delete(`${url}/${listName}/${taskId}`);
		e.target.parentElement.parentElement.parentElement.remove();
	} catch (error) {
		throw new Error(error);
	}
};

const getTodoData = async (taskId, listName) => {
	const response = await axios.get(`${url}/${listName}/${taskId}`);
	const data = response.data;
	const userData = { id: data.id, title: data.title };
	return userData;
};

const initialRender = async (listName) => {
	const tasks = await axios.get(`${url}/${listName}`);

	tasks.data.forEach((task) => {
		listName === "todoTasksList"
			? createTask(task, true)
			: createTask(task, false);
	});
};

initialRender("todoTasksList");
initialRender("doneTasksList");

const doneHandler = async (taskId, e) => {
	const userData = await getTodoData(taskId, "todoTasksList");
	addNewTaskToDB("doneTasksList", userData);
	createTask(userData, false);
	deleteTask("todoTasksList", taskId, e);
};
const undoHandler = async (taskId, e) => {
	const userData = await getTodoData(taskId, "doneTasksList");
	addNewTaskToDB("todoTasksList", userData);
	createTask(userData, true);
	deleteTask("doneTasksList", taskId, e);
};

const editMode = async (taskId, e) => {
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

	taskInput.addEventListener("keydown", async (e) => {
		if (e.key === "Enter") {
			await axios.patch(`${url}/todoTasksList/${taskId}`, {
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
const editTask = async (taskId, e) => {
	const editButton = e.target;
	editButton.classList.remove("btn-edit-done");
	editButton.classList.add("btn-edit");
	taskInput = document.querySelector(".edit-input");
	await axios.patch(`${url}/todoTasksList/${taskId}`, {
		title: taskInput.value,
	});

	editButton.src = "./assets/edit-fill.svg";

	const newSpan = document.createElement("span");
	newSpan.textContent = taskInput.value;
	taskInput.replaceWith(newSpan);
};

// New task input validation
taskInput.addEventListener("input", (e) => {
	if (taskInput.value.trim() == "") {
		addButton.disabled = true;
	} else {
		addButton.disabled = false;
	}
});

// Add a new task
addButton.addEventListener("click", (e) => {
	e.preventDefault();
	createTask(taskInput.value, true);
	addNewTaskToDB("todoTasksList", { title: taskInput.value, id: nextId++ });
});

document.querySelector(".tasks-container").addEventListener("click", (e) => {
	e.preventDefault();

	const taskId = e.target.parentElement.parentElement.parentElement.id;

	if (e.target.classList.contains("btn-delete-todo")) {
		deleteTask("todoTasksList", taskId, e);
	} else if (e.target.classList.contains("btn-delete-done")) {
		deleteTask("doneTasksList", taskId, e);
	} else if (e.target.classList.contains("btn-done")) {
		doneHandler(taskId, e);
	} else if (e.target.classList.contains("btn-edit")) {
		editMode(taskId, e);
	} else if (e.target.classList.contains("btn-edit-done")) {
		editTask(taskId, e);
	} else if (e.target.classList.contains("btn-undo")) {
		undoHandler(taskId, e);
	}
});
