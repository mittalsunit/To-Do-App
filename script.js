const inputBox = document.getElementById("input-box");
const dateBox = document.getElementById("date-box");
const categoryBox = document.getElementById("category-box");
const priorityBox = document.getElementById("priority-box");
const listContainer = document.getElementById("list-container");
const searchBox = document.getElementById("search-box");
const sortBox = document.getElementById("sort-box");
const themeToggle = document.getElementById("theme-toggle");

function addTask() {
    if (inputBox.value === '' || dateBox.value === '') {
        alert("You must write something and select a date!");
    } else {
        let li = document.createElement("li");

        let taskText = inputBox.value;
        let taskDate = dateBox.value;
        let taskCategory = categoryBox.value;
        let taskPriority = priorityBox.value;

        let [year, month, day] = taskDate.split("-");
        let formattedDate = `${day}-${month}-${year}`;

        li.innerHTML = `${taskText} <span class="date">${formattedDate}</span> <span class="category">${taskCategory}</span> <span class="priority">${taskPriority}</span>`;
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.className = "remove";
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        updateProgressBar();
    }

    inputBox.value = "";
    dateBox.value = "";
    categoryBox.value = "Work";
    priorityBox.value = "Medium";
    saveData();
}

/* Add click event listener to toggle 'completed' class */
listContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove")) {
        e.target.parentElement.remove();
        saveData();
    } else if (e.target.tagName === "LI") {
        e.target.classList.toggle("completed"); // Toggle strikethrough class
        saveData();
    }
    updateProgressBar();
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    updateProgressBar();
}

searchBox.addEventListener("input", function () {
    let filter = searchBox.value.toLowerCase();
    let tasks = listContainer.getElementsByTagName("li");

    Array.from(tasks).forEach(task => {
        let taskText = task.textContent || task.innerText;
        task.style.display = taskText.toLowerCase().includes(filter) ? "" : "none";
    });
});

sortBox.addEventListener("change", function () {
    let tasks = Array.from(listContainer.getElementsByTagName("li"));
    let sortType = sortBox.value;

    tasks.sort((a, b) => {
        if (sortType === "date") {
            return new Date(a.querySelector(".date").textContent.split("-").reverse().join("-")) -
                   new Date(b.querySelector(".date").textContent.split("-").reverse().join("-"));
        } else if (sortType === "priority") {
            let priorities = { "High": 1, "Medium": 2, "Low": 3 };
            return priorities[a.querySelector(".priority").textContent] - priorities[b.querySelector(".priority").textContent];
        } else if (sortType === "alphabet") {
            return a.textContent.localeCompare(b.textContent);
        }
        return 0;
    });

    listContainer.innerHTML = "";
    tasks.forEach(task => listContainer.appendChild(task));
    saveData();
});

function clearAll() {
    listContainer.innerHTML = "";
    saveData();
    updateProgressBar();
}

function updateProgressBar() {
    let tasks = listContainer.getElementsByTagName("li");
    let completedTasks = listContainer.getElementsByClassName("completed").length;
    let progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    document.getElementById("progress-bar").style.width = progress + "%";
}

themeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode");
    document.querySelector(".todo-app").classList.toggle("dark-mode");

    saveThemePreference();
});

function saveThemePreference() {
    localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
}

function loadThemePreference() {
    if (localStorage.getItem("theme") === "dark") {
        themeToggle.checked = true;
        document.body.classList.add("dark-mode");
        document.querySelector(".container").classList.add("dark-mode");
        document.querySelector(".todo-app").classList.add("dark-mode");
    }
}

loadThemePreference();
showTask();