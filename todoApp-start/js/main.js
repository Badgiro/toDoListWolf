const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach((task) => {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //формируем разметку для новой задачи
  const taskHTML = `
              <li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
                  <span class="${cssClass}">${task.text}</span>
                  <div class="task-item__buttons">
                      <button type="button" data-action="done" class="btn-action">
                          <img src="./img/tick.svg" alt="Done" width="18" height="18">
                      </button>
                      <button type="button" data-action="delete" class="btn-action">
                          <img src="./img/cross.svg" alt="Done" width="18" height="18">
                      </button>
                  </div>
              </li>`;

  //добавляем задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
});

const fetchData = async () => {
  const { data } = axios.get("https://jsonplaceholder.typicode.com/todos/1");
  console.log(data);
};

fetchData();
checkEmptyList();

form.addEventListener("submit", newTask);

tasksList.addEventListener("click", removeTask);

tasksList.addEventListener("click", taskIsReady);

//функции

function newTask(event) {
  //отменяем отправку формы
  event.preventDefault();

  //достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // добавляем задачу в массив с задачами
  tasks.push(newTask);

  saveToLocalStorage();

  console.log(tasks);

  const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

  //формируем разметку для новой задачи
  const taskHTML = `
              <li id = "${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
                  <span class="${cssClass}">${newTask.text}</span>
                  <div class="task-item__buttons">
                      <button type="button" data-action="done" class="btn-action">
                          <img src="./img/tick.svg" alt="Done" width="18" height="18">
                      </button>
                      <button type="button" data-action="delete" class="btn-action">
                          <img src="./img/cross.svg" alt="Done" width="18" height="18">
                      </button>
                  </div>
              </li>`;

  //добавляем задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);

  //очищаем поле ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function removeTask(event) {
  //проверяем, что клик был по кнопке удалить задачу
  if (event.target.dataset.action !== "delete") return;

  console.log("DELETE!!!");
  const parentNode = event.target.closest(".list-group-item");

  //Определяем id задачи
  const id = Number(parentNode.id);

  // //находим игдекс задачи в массиве
  // const index = tasks.findIndex((task) => task.id === id);

  // //удаляем задачу из массива
  // tasks.splice(index, 1);

  //можно удалить и так
  tasks = tasks.filter((task) => task.id !== id);

  //удаляем задачу из разметки
  parentNode.remove();

  saveToLocalStorage();

  checkEmptyList();
}

function taskIsReady(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-group-item");

  //определяем id задачи
  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  console.log(task);

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  saveToLocalStorage();
}

function checkEmptyList() {
  if (Number(tasks.length) === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// function renderTask ()
