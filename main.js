pendingTodosContainer = document.querySelector(".pending-todos-container");
doneTodosContainer = document.querySelector(".done-todos-container");
todoInputEl = document.querySelector(".todo-input");
addButton = document.querySelector(".add-btn");
doneButton = document.querySelector(".done-btn");

renderPendingTask = (task) => {
	pendingTodosContainer.innerHTML += `
	<li class="todo-item rounded-4 px-2 m-2 id="${task.id}">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="">${
																													task.title ? task.title : task
																												}</span>
                            <div class="icons">
                                <button class="btn "><img class="btn-delete" src="./assets/delete.svg" alt=""></button>
                                <button class="btn "><img class="btn-done" src="./assets/done.svg" alt=""></button>
                            </div>
                        </div>
                    </li>
	`;
};
renderDoneTask = (task) => {
	doneTodosContainer.innerHTML += `
                    <li class="todo-item rounded-4 px-2 m-2" >
                        <div class="d-flex align-items-center justify-content-between">
                            <span class=" text-decoration-line-through">${task.title}</span>
                            <div class="icons">
                                <button class="btn "><img class="btn-delete" src="./assets/delete.svg" alt=""></button>
                                <button class="btn "><img class="btn-undo" src="./assets/undo.svg" alt=""></button>
                            </div>
                        </div>
                    </li>
	`;
};

const url = "http://localhost:3000/";

const getPendingTodosData = () => {
	fetch(url + "todos")
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
	fetch(url + "dones")
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
		if (e.target.classList.contains("btn-delete")) {
			e.target.parentElement.parentElement.parentElement.remove();
		}
	});
