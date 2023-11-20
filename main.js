pendingTodosContainer = document.querySelector(".pending-todos-container");
doneTodosContainer = document.querySelector(".done-todos-container");
todoInputEl = document.querySelector(".todo-input");
addButton = document.querySelector(".add-btn");
doneButton = document.querySelector(".done-btn");

// Functions
const fetchData = async () => {
	try {
		const res = await fetch(url + "/todos");
		const data = await res.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};
renderPendingTask = (task) => {
	pendingTodosContainer.innerHTML += `
	<li class="todo-item rounded-4 px-2 m-2 " id="${task.id}">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="">${
																													task.title ? task.title : task
																												}</span>
                            <div class="icons">
                                <a href="#" class="btn "><img class="btn-delete" src="./assets/delete.svg" alt=""></a>
                                <a href="#" class="btn "><img class="btn-done" src="./assets/done.svg" alt=""></a>
                            </div>
                        </div>
                    </li>
	`;
};
renderDoneTask = (task) => {
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

const url = "http://localhost:3000";

const getPendingTodosData = () => {
	fetch(url + "/todos")
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			data.forEach((task) => {
				renderPendingTask(task);
			});
		});
};
const getDoneTodosData = () => {
	fetch(url + "/dones")
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			data.forEach((task) => {
				renderDoneTask(task);
			});
		});
};

getPendingTodosData();
getDoneTodosData();

todoInputEl.addEventListener("input", (e) => {
	if (todoInputEl.value.trim() == "") {
		addButton.disabled = true;
	} else {
		addButton.disabled = false;
	}
});

addButton.addEventListener("click", (e) => {
	e.preventDefault();
	renderPendingTask(todoInputEl.value);
});

document
	.querySelector(".pending-todos-container")
	.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target.classList.contains("btn-delete")) {
			deleteTodo(
				e.target.parentElement.parentElement.parentElement.parentElement.id,
				"todos",
				e
			);
		}
	});
document
	.querySelector(".done-todos-container")
	.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target.classList.contains("btn-delete")) {
			console.log(
				e.target.parentElement.parentElement.parentElement.parentElement
			);
			console.log(
				e.target.parentElement.parentElement.parentElement.parentElement.id
			);
			deleteTodo(
				e.target.parentElement.parentElement.parentElement.parentElement.id,
				"dones",
				e
			);
		}
	});

const deleteTodo = async (taskId, fromList, e) => {
	e.preventDefault();
	try {
		await axios.delete(`${url}/${fromList}/${taskId}`);
		e.target.parentElement.parentElement.parentElement.remove();
	} catch (error) {
		console.error(error);
	}
};
