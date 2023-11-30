// json-server --p 3010 .\data\db.json

// Global Variables
const url = "http://localhost:3010";
let nextId;

todoTasksContainer = document.querySelector(".todo-tasks-container");
doneTasksContainer = document.querySelector(".done-tasks-container");
taskInput = document.querySelector(".task-input");
addButton = document.querySelector(".btn-add");
doneButton = document.querySelector(".btn-done");

// Functions
const addNewTaskToDB = async (toTheList, userData) => {
	try {
		await axios.post(`${url}/${toTheList}`, userData);
	} catch (error) {
		throw new Error(error);
	}
};

const getNextIdFromDB = async () => {
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

getNextIdFromDB();

const createTask = async (task, isInTodoList) => {
	if (task.id) {
		id = task.id;
	} else {
		id = nextId;
	}

	const listItem = document.createElement("li");

	let container = isInTodoList ? todoTasksContainer : doneTasksContainer;
	listItem.innerHTML += `
		<li class="hidden todo-item rounded-4 px-2 py-1 m-2 d-flex align-items-center justify-content-between " id="${id}">                   
			<span class="${isInTodoList ? "" : "text-decoration-line-through gray-text"}">${
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
	container.prepend(listItem);
	visualEffectShow(id);
};

const visualEffectShow = (taskId) => {
	setTimeout(() => {
		todoItem = document.getElementById(taskId);
		todoItem.classList.remove("hidden");
		todoItem.classList.add("show");
	}, 300);
};
const deleteTask = async (listName, taskId, e) => {
	e.preventDefault();
	try {
		await axios.delete(`${url}/${listName}/${taskId}`);
		setTimeout(() => {
			e.target.parentElement.parentElement.parentElement.remove();
		}, 200);
	} catch (error) {
		throw new Error(error);
	}
};

const getTodoData = async (taskId, listName) => {
	try {
		const response = await axios.get(`${url}/${listName}/${taskId}`);
		const data = response.data;
		const userData = { id: data.id, title: data.title };
		return userData;
	} catch (error) {
		throw new Error(error);
	}
};

const initialRender = async (listName) => {
	try {
		const tasks = await axios.get(`${url}/${listName}`);

		tasks.data.forEach((task) => {
			listName === "todoTasksList"
				? createTask(task, true)
				: createTask(task, false);
		});
	} catch (error) {
		throw new Error(error);
	}
};

initialRender("todoTasksList");
initialRender("doneTasksList");

const doneHandler = async (taskId, e) => {
	const userData = await getTodoData(taskId, "todoTasksList");
	addNewTaskToDB("doneTasksList", userData);
	await deleteTask("todoTasksList", taskId, e);
	createTask(userData, false);
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
	let editTaskInput;

	editButton.src = "./assets/round-done.svg";
	editButton.classList.add("btn-edit-done");
	editButton.classList.remove("btn-edit");

	const taskSpan = taskItem.querySelector("span");

	editTaskInput = document.createElement("input");
	editTaskInput.classList.add("edit-input");
	editTaskInput.type = "text";
	editTaskInput.value = taskSpan?.textContent;

	taskSpan.replaceWith(editTaskInput);

	editTaskInput.focus();

	editTaskInput.addEventListener("keydown", async (e) => {
		if (e.key === "Enter") {
			try {
				await axios.patch(`${url}/todoTasksList/${taskId}`, {
					title: editTaskInput.value,
				});

				editButton.src = "./assets/edit-fill.svg";

				const newSpan = document.createElement("span");
				newSpan.textContent = editTaskInput.value;
				editTaskInput.replaceWith(newSpan);

				isEditing = false;
			} catch (error) {
				throw new Error(error);
			}
		}
	});
};
const editTask = async (taskId, e) => {
	const editButton = e.target;
	editButton.classList.remove("btn-edit-done");
	editButton.classList.add("btn-edit");
	editTaskInput = document.querySelector(".edit-input");
	await axios.patch(`${url}/todoTasksList/${taskId}`, {
		title: editTaskInput.value,
	});

	editButton.src = "./assets/edit-fill.svg";

	const newSpan = document.createElement("span");
	newSpan.textContent = editTaskInput.value;
	editTaskInput.replaceWith(newSpan);
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
	taskInput.value = "";
	addButton.disabled = true;
});

document.querySelector(".tasks-container").addEventListener("click", (e) => {
	e.preventDefault();

	const taskId = e.target.parentElement.parentElement.parentElement.id;
	const parentElement = e.target.parentElement.parentElement.parentElement;

	if (e.target.classList.contains("btn-delete-todo")) {
		parentElement.style.transform = "scale(0)";
		deleteTask("todoTasksList", taskId, e);
	} else if (e.target.classList.contains("btn-delete-done")) {
		parentElement.style.transform = "scale(0)";
		deleteTask("doneTasksList", taskId, e);
	} else if (e.target.classList.contains("btn-done")) {
		parentElement.style.transform = "scale(0)";
		doneHandler(taskId, e);
	} else if (e.target.classList.contains("btn-edit")) {
		editMode(taskId, e);
	} else if (e.target.classList.contains("btn-edit-done")) {
		editTask(taskId, e);
	} else if (e.target.classList.contains("btn-undo")) {
		parentElement.style.transform = "scale(0)";
		undoHandler(taskId, e);
	}
});
