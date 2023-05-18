const taskInput = document.getElementById("new-task");
const addButton = document.getElementsByTagName("button")[0];
const incompleteTasksHolder = document.getElementById("incomplete-tasks");
const completedTasksHolder = document.getElementById("completed-tasks");

//New Task List item

const createNewTaskElement = function(taskString) {
    // create List Item
    let listItem = document.createElement("li");
    // input checkbox
    let checkBox = document.createElement("input");
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

    return listItem;
}


//Add a new task
const addTask = function() {
    console.log("Add Task...");
    //Create a new list item with the text from the #new-task:
    let listItem = createNewTaskElement(taskInput.value);
    //Append listItem to incompleteTaskHolder
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
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
    } else {
        editInput.value = label.innerText;
    }

    listItem.classList.toggle("editMode");
}

//Delete an existing task
const deleteTask = function () {
    console.log("Delete Task...");

    let listItem = this.parentNode;
    let ul = listItem.parentNode;

    ul.removeChild(listItem);
}

//Mark a task as complete
const taskCompleted = function() {
    console.log("Task Complete...");

    let listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
}


//Mark a task as incomplete
const taskIncomplete = function() {
    console.log("Task Incomplete...");

    let listItem = this.parentNode;
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
}

addButton.addEventListener("click", addTask);


const bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    console.log("Bind List item events");
    // select listitems chidlren
    let checkBox = taskListItem.querySelector('input[type="checkbox"]');
    let editButton = taskListItem.querySelector("button.edit");
    let deleteButton = taskListItem.querySelector("button.delete");
    //bind editTask to edit button
    editButton.onclick = editTask;
    //bind deleteTask to delete button
    deleteButton.onclick = deleteTask;
    //bind checkBoxEventHandler to checkbox
    checkBox.onchange = checkBoxEventHandler;

}

//cycle over incompleteTaskHolder ul list items
for (let i = 0; i < incompleteTasksHolder.children.length; i ++) {
    //bind events to list item's children (taskCompleted)
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

//cycle over completedTaskHolder ul list items
for (let i = 0; i < completedTasksHolder.children.length; i ++) {
    //bind events to list item's children (taskCompleted)
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
