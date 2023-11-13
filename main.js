todoContainer = document.querySelector(".todo-container");

const url = "http://localhost:3000/todos";

const getTodosData = () => {
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
		});
};

getTodosData();
