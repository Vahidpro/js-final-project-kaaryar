// import axios from "axios";

todoContainer = document.querySelector(".todo-container");

const getTodos = () => {
	axios.get("/data/db.json").then((res) => {
		console.log(res);
	});
};

getTodos();
