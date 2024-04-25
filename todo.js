async function addTodo() {
    let task = document.getElementById("task-todo").value;
    let description = document.getElementById("disc-todo").value;

    let todo = {
        task,
        description
    };

    try {
        // Store todo locally
        localStorage.setItem(`${todo.task}`, JSON.stringify(todo));
        
        // Post todo to server
        const response = await axios.post("https://crudcrud.com/api/575edb7343ea4e3f86409d228078b92e/todo", todo);
        console.log(response.data);
        
        // Refresh todo list
        await getTodo();
    } catch (error) {
        console.error(error);
    }
}

async function getTodo() {
    try {
        const response = await axios.get("https://crudcrud.com/api/575edb7343ea4e3f86409d228078b92e/todo");
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = ""; // Clear previous entries
        
        response.data.forEach(todo => {
            const newLi = document.createElement("li");
            newLi.innerHTML = `${todo.task} - ${todo.description}`;
            newLi.style = "width: 40%; margin: 10px auto; list-style-type: none; display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;";

            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.name = "check";
            checkBox.id = "check-box";
            checkBox.style = "width: 40px; padding:30px "
            checkBox.addEventListener("change", async function() {
                if (this.checked) {
                    await deleteTodoAndMoveToDone(todo._id, newLi); // Delete todo item and move to done list
                }
            });
            
            newLi.appendChild(checkBox);
            todoList.appendChild(newLi);

            // Delete button
            const deletebtn = document.createElement("button");
            deletebtn.innerHTML = "Delete";
            deletebtn.addEventListener("click", async function() {
                await deleteTodo(todo._id);
                newLi.remove(); // Remove the todo item from the list
            });
            newLi.appendChild(deletebtn);
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteTodoAndMoveToDone(id, todoItem) {
    try {
        // Delete todo from server
        await axios.delete("https://crudcrud.com/api/575edb7343ea4e3f86409d228078b92e/todo/" + id);
        console.log("todo deleted: " + id);
        
        // Move todo item to done list
        moveTodoToDoneList(todoItem);
    } catch (error) {
        console.log(error);
    }
}

function moveTodoToDoneList(todoItem) {
    const doneList = document.getElementById("done-list");
    doneList.appendChild(todoItem);
}

window.addEventListener("DOMContentLoaded", getTodo);

// Function to load completed todo items from local storage and move them to the done list on page load
window.addEventListener("load", async function() {
    try {
        const completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];
        const doneList = document.getElementById("done-list");
        completedTodos.forEach(todoId => {
            const todoItem = document.getElementById(todoId);
            if (todoItem) {
                doneList.appendChild(todoItem);
            }
        });
    } catch (error) {
        console.error(error);
    }
});
