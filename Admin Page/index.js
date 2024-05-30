// script.js
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('changeColorBtn').addEventListener('click', changeBackgroundColor);
document.getElementById('addImageBtn').addEventListener('click', () => document.getElementById('imageInput').click());
document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
window.addEventListener('load', loadFromLocalStorage);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value;
    if (taskText === '') return;

    createTaskItem(taskText);
    taskInput.value = '';
    saveToLocalStorage();
}

function createTaskItem(taskText) {
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = 'taskItem';

    taskItem.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    taskList.appendChild(taskItem);
}

function editTask(button) {
    const taskItem = button.parentNode.parentNode;
    const taskTextElement = taskItem.querySelector('span');
    const taskText = taskTextElement.innerText;

    const newTaskText = prompt('Edit task:', taskText);
    if (newTaskText !== null) {
        taskTextElement.innerText = newTaskText;
        saveToLocalStorage();
    }
}

function deleteTask(button) {
    const taskItem = button.parentNode.parentNode;
    taskItem.remove();
    saveToLocalStorage();
}

function changeBackgroundColor() {
    const colors = ['#f4f4f4', '#ffdddd', '#ddffdd', '#ddddff'];
    const currentColor = document.body.style.backgroundColor;
    let newColor = colors[Math.floor(Math.random() * colors.length)];
    while (newColor === currentColor) {
        newColor = colors[Math.floor(Math.random() * colors.length)];
    }
    document.body.style.backgroundColor = newColor;
    saveToLocalStorage();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addImageToContainer(e.target.result);
            saveToLocalStorage();
        };
        reader.readAsDataURL(file);
    }
}

function addImageToContainer(imageUrl) {
    const imageContainer = document.getElementById('imageContainer');
    const imageItem = document.createElement('div');
    imageItem.className = 'imageItem';

    imageItem.innerHTML = `
        <img src="${imageUrl}" alt="Uploaded Image">
        <button onclick="deleteImage(this)">×</button>
    `;

    imageContainer.appendChild(imageItem);
}

function deleteImage(button) {
    const imageItem = button.parentNode;
    imageItem.remove();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#taskList .taskItem span').forEach(task => tasks.push(task.innerText));
    const backgroundColor = document.body.style.backgroundColor;

    const images = [];
    document.querySelectorAll('#imageContainer img').forEach(img => images.push(img.src));

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('images', JSON.stringify(images));
}

function loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const backgroundColor = localStorage.getItem('backgroundColor') || '#f4f4f4';
    const images = JSON.parse(localStorage.getItem('images')) || [];

    tasks.forEach(taskText => createTaskItem(taskText));
    document.body.style.backgroundColor = backgroundColor;
    images.forEach(imageUrl => addImageToContainer(imageUrl));
}
