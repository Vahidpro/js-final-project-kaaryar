todoTasksContainer = document.querySelector(".todo-tasks-container");
doneTasksContainer = document.querySelector(".done-tasks-container");
taskInput = document.querySelector(".todo-input");
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
	let container = isPending ? todoTasksContainer : doneTasksContainer;

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
	addNewTaskToDB("todoTasksList", { title: taskInput.value });
});

document
	.querySelector(".todo-tasks-container")
	.addEventListener("click", (e) => {
		e.preventDefault();
		const taskId = e.target.parentElement.parentElement.parentElement.id;
		if (e.target.classList.contains("btn-delete")) {
			deleteTask("todoTasksList", taskId, e);
		} else if (e.target.classList.contains("btn-done")) {
			doneHandler(taskId, e);
		} else if (e.target.classList.contains("btn-edit")) {
			editMode(taskId, e);
		} else if (e.target.classList.contains("btn-edit-done")) {
			editTask(taskId, e);
		}
	});

document
	.querySelector(".done-tasks-container")
	.addEventListener("click", (e) => {
		e.preventDefault();
		const taskId = e.target.parentElement.parentElement.parentElement.id;
		if (e.target.classList.contains("btn-delete")) {
			deleteTask("doneTasksList", taskId, e);
		} else if (e.target.classList.contains("btn-undo")) {
			undoHandler(taskId, e);
		}
	});

var deleteTask = async (listName, taskId, e) => {
	e.preventDefault();
	try {
		await axios.delete(`${url}/${listName}/${taskId}`);
		e.target.parentElement.parentElement.parentElement.remove();
	} catch (error) {
		console.error(error);
	}
};
