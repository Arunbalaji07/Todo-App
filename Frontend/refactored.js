const taskInput = document.getElementById("new-task");
const addButton = document.getElementsByTagName("button")[0];
const tasks = document.getElementById("tasks");

const createNewTaskElement = function(taskString, id) {
    console.log(taskString);
    let listItem = document.createElement("li");
    // console.log(listItem)
    listItem.id=id
    // input checkbox
    let checkBox = document.createElement("input");
    // console.log(checkBox);
    // label
    let label = document.createElement("label");
    // input (text)
    let editInput = document.createElement("input");
    // button.edit
    let editButton = document.createElement("button");
    // button.delete
    let deleteButton = document.createElement("button");

    //Each element needs modified

    checkBox.type = "checkBox";
    editInput.type = "text";
    checkBox.id = "checkBox";

    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    label.innerText = taskString;

    // Each element needs appending
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    tasks.appendChild(listItem);

    return listItem
};

const URL = "http://localhost:8080/api/todos/";

const fetchTasks = async () => {
    try {
        const res = await fetch(URL);
        const responseJson = await res.json();

        for (const item of Object.values(responseJson.data)) {
            const listItem = createNewTaskElement(item.item, item.id);
            bindTaskEvents(listItem);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};

// Fetch data from the server and create task elements using async/await
fetchTasks();

const addTask = async () => {
    console.log("Add Task...");
    const listItem = createNewTaskElement(taskInput.value);
    tasks.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    const url = "http://localhost:8080/api/todos";

    const data = {
        item: taskInput.value,
    };

    const fetchData = {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        })
    };

    try {
        const res = await fetch(url, fetchData);
        console.log(res);
    } catch (error) {
        console.error("Error adding task:", error);
    }

    taskInput.value = "";
};

const editTask = async function() {
    console.log("Edit Task...");
    const listItem = this.parentNode;
    const editInput = listItem.querySelector("input[type=text]");
    const label = listItem.querySelector("label");
    const containsClass = listItem.classList.contains("editMode");

    if (containsClass) {
        label.innerText = editInput.value;

        const url = `http://localhost:8080/api/todos/${listItem.id}`;
        const data = { "item" : editInput.value };

        const updateMethod = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json; Charset=UTF-8'
            })
        };

        try {
            const res = await fetch(url, updateMethod);
            console.log(res);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    } else {
        editInput.value = label.innerText;
    }

    listItem.classList.toggle("editMode");
};

const deleteTask = async function () {
    console.log("Delete Task...");
    const listItem = this.parentNode;
    const ul = listItem.parentNode;

    try {
        ul.removeChild(listItem);
        const url = `http://localhost:8080/api/todos/${listItem.id}`;
        const deleteMethod = {
            method: "DELETE",
            headers: new Headers({
                'Content-Type': 'application/json; Charset=UTF-8'
            })
        };

        const res = await fetch(url, deleteMethod);
        console.log(res);
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

const taskCompleted = function() {
    console.log("Task Complete...");
    const listItem = this.parentNode;
    bindTaskEvents(listItem);
};

const checkedTask = async (cbe) => {
    const checkBox = cbe.target;
    console.log(checkBox);
    const listItem = checkBox.parentNode;
    const status = checkBox.checked ? "COMPLETED" : "IN_PROGRESS";
    const url = `http://localhost:8080/api/todos/${listItem.id}`;

    const data = { "status": status };
    const completed = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        })
    };

    try {
        const res = await fetch(url, completed);
        console.log(res);
    } catch (error) {
        console.error("Error updating task status:", error);
    }
};

const bindTaskEvents = function(taskListItem) {
    const checkBox = taskListItem.querySelector('input[type="checkbox"]');
    const editButton = taskListItem.querySelector("button.edit");
    const deleteButton = taskListItem.querySelector("button.delete");

    editButton.addEventListener('click', editTask);
    deleteButton.addEventListener('click', deleteTask);
    checkBox.addEventListener('change', (cbe) => checkedTask(cbe));
};

addButton.addEventListener("click", addTask);