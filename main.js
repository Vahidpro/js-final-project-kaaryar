pendingTodosContainer = document.querySelector(".pending-todos-container");
doneTodosContainer = document.querySelector(".done-todos-container");

renderPendingTask = (task) => {
	pendingTodosContainer.innerHTML += `
	<li class="todo-item rounded-4 px-2 m-2">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="">${task.title}</span>
                            <div class="icons">
                                <button class="btn"><img src="./assets/delete.svg" alt=""></button>
                                <button class="btn"><img src="./assets/done.svg" alt=""></button>
                            </div>
                        </div>
                    </li>
	`;
};
renderDoneTask = (task) => {
	doneTodosContainer.innerHTML += `
                    <li class="todo-item rounded-4 px-2 m-2">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class=" text-decoration-line-through">${task.title}</span>
                            <div class="icons">
                                <button class="btn"><img src="./assets/delete.svg" alt=""></button>
                                <button class="btn"><img src="./assets/undo.svg" alt=""></button>
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
