const form = document.getElementById("form");
const formInput = document.getElementById("formInput");
const clearBtn = document.getElementById("clearBtn");
const todos = document.getElementById("todos");
const note = document.querySelector(".note");

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("Service Worker Failed", err));
}


form.addEventListener("submit", (e)=> {
    e.preventDefault();
    let todoObj = {
        value: formInput.value.trim(),
        checked: 0
    };
    if(!todoObj.value) {
        return;
    }
    createTodo(todoObj);
    formInput.value = "";
    formInput.focus();
});

clearBtn.addEventListener("click", ()=> {
    todos.innerHTML = '';
    localStorage.clear();
    note.innerText = `Enter some items to get started.`;
})

function createTodo(todo) {
    let newLi = document.createElement("li");
    newLi.innerHTML = `<span id="todoText"></span><button id="trashBtn" title="Remove To-do">❌</button>`;
    newLi.id = "todo";
    let text = newLi.querySelector("#todoText");
    text.innerText = todo.value;
    if(todo.checked) {
        newLi.classList.add("checked");
    }
    todos.appendChild(newLi);
    updateLS();

    newLi.addEventListener("click", (e)=> {
        let clicked = e.target;
        if(clicked.id === "trashBtn") {
            deleteTodo(newLi);
        } else if(clicked.id === "todo") {
            newLi.classList.toggle("checked");
            todo.checked = todo.checked === 0 ? 1 : 0;
            updateLS();
        }
    })
}

function deleteTodo(todo) {
    todo.remove();
    updateLS();
}

function updateLS() {
    const allTodos = document.querySelectorAll("#todo");
    let todoArr = [];
    let checkedCount = 0;

    allTodos.forEach(todo => {
        let newObj = {
            value: todo.children[0].innerText,
            checked: todo.classList.contains("checked") ? 1 : 0
        }
        todoArr.push(newObj);
        if(todo.classList.contains("checked")) {
            checkedCount++;
        }
    })
    localStorage.setItem("todos", JSON.stringify(todoArr));
    if(allTodos.length <= 0) {
        note.innerText = `Enter some items to get started.`;
    } else if(allTodos.length === 1) {
            note.innerText = `${checkedCount}/${allTodos.length} task completed.`
    } else {
            note.innerText = `${checkedCount}/${allTodos.length} tasks completed.`
    }
}

function getTodos() {
    let savedTodos = JSON.parse(localStorage.getItem("todos")) || []

    savedTodos.forEach(todo => {
        createTodo(todo);
    })
}

getTodos();