const taskInput = document.getElementById("new-task");
const addButton = document.getElementsByTagName("button")[0];
const tasks = document.getElementById("tasks");

// const completedTasksHolder = document.getElementById("completed-tasks");

//New Task List item

const createNewTaskElement = function(taskString, id) {
    // create List Item
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
}


const URL = "http://localhost:8080/api/todos/"

fetch(URL)
    .then(res => res.json())
    .then(responseJson => {
        for (let item of Object.values(responseJson.data)){

            const listItem = createNewTaskElement(item.item, item.id)
            bindTaskEvents(listItem);
            // )
            //     // incompleteTasksHolderincompleteTasksHolder.appendChild(todoItem.appendChild(deleteButton)

        }
        // console.log(JSON.stringify(responseJson))
    })




//Add a new task
const addTask = function() {
    console.log("Add Task...");
    //Create a new list item with the text from the #new-task:
    let listItem = createNewTaskElement(taskInput.value);
    //Append listItem to incompleteTaskHolder
    tasks.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    const url = "http://localhost:8080/api/todos"

    const data = {
        "item": taskInput.value
    }
    const fetchData = {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        })
    }
    fetch(url, fetchData)
        .then(res => console.log(res))

    taskInput.value = "";
}

//Edit an existing task
const editTask = function() {
    console.log("Edit Task...");

    let listItem = this.parentNode;



    let editInput = listItem.querySelector("input[type=text]");
    let label = listItem.querySelector("label");

    let containsClass = listItem.classList.contains("editMode");


    if (containsClass) {
        label.innerText = editInput.value;

        const url = `http://localhost:8080/api/todos/${listItem.id}`

        const data = {
            "item" : editInput.value
        }

        const updateMethod = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json; Charset=UTF-8'
            })
        }

        fetch (url, updateMethod)
            .then(res => console.log(res))
    } else {
        editInput.value = label.innerText;
    }

    listItem.classList.toggle("editMode");


}

//Delete an existing task
const deleteTask = function () {
    // console.log(id)
    console.log("Delete Task...");

    let listItem = this.parentNode;
    // listItem.id = id;
    // console.log(listItem.id)
    let ul = listItem.parentNode;
    console.log(ul)
    ul.removeChild(listItem);

    const url = `http://localhost:8080/api/todos/${listItem.id}`

    const deleteMethod = {
        method: "DELETE",
        headers: new Headers({
            'Content-Type': 'application/json; Charset=UTF-8'
        })
    }

    fetch(url, deleteMethod)
        .then(res => console.log(res));

}


//Mark a task as complete
const taskCompleted = function() {
    console.log("Task Complete...");

    let listItem = this.parentNode;
    // console.log(listItem);￼
    // completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem);
}


//Mark a task as incomplete
const taskIncomplete = function() {
    console.log("Task Incomplete...");

    let listItem = this.parentNode;
    tasks.appendChild(listItem);
    bindTaskEvents(listItem);
}

addButton.addEventListener("click", addTask);



const checkedTask = () => {
    const listItem = this.parentNode
    console.log(listItem)

    // const checkBtn = listItem.querySelector('input[type="checkBox"]')
    // console.log(checkBtn)

    if(this.checked) {
        console.log('checked')
        const url = `http://localhost:8080/api/todos/${listItem.id}`

        const data = {
            "status": "COMPLETED"
        }

        const completed = {

            method: "PUT",
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        }

        fetch(url, completed)
            .then(res => console.log(res))
    } else {
        console.log("Not checked")
    }
}

const bindTaskEvents = function(taskListItem) {
    // console.log("Bind List item events");
    // console.log(taskListItem)
    // select listitems chidlren
    let checkBox = taskListItem.querySelector('input[type="checkbox"]');
    let editButton = taskListItem.querySelector("button.edit");
    let deleteButton = taskListItem.querySelector("button.delete");
    // console.log(checkBox)
    //bind editTask to edit button
    editButton.addEventListener('click', editTask);
    //bind deleteTask to delete button
    deleteButton.addEventListener('click', deleteTask);
    //bind checkBoxEventHandler to checkbox
    // checkBox.onchange = checkBoxEventHandler;
    checkBox.addEventListener('change', checkedTask);
}

//cycle over incompleteTaskHolder ul list items
// for (let i = 0; i < tasks.children.length; i ++) {
//     //bind events to list item's children (taskCompleted)
//     bindTaskEvents(tasks.children[i], taskCompleted);
// }

//cycle over completedTaskHolder ul list items
// for (let i = 0; i < completedTasksHolder.children.length; i ++) {
//     //bind events to list item's children (taskCompleted)
//     bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
// }
