todoContainer = document.querySelector(".todo-container");

renderTask = (task) => {
	todoContainer.innerHTML += `
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

const url = "http://localhost:3000/todos";

const getTodosData = () => {
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			data.forEach((task) => {
				renderTask(task);
			});
			// renderTask(data[0]);
		});
};

getTodosData();
