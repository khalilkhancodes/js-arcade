const darkMode = document.getElementById("dark-mode");
const lightMode = document.getElementById("light-mode");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const timeDisplay = document.querySelector(".time-display");
const body = document.body;


darkMode.addEventListener("click", () => {
    body.classList.add("dark");
    darkMode.classList.toggle("hidden");
    lightMode.classList.toggle("hidden");
    // body.classList.remove("hidden");
});

lightMode.addEventListener("click", () => {
    body.classList.remove("dark");
    lightMode.classList.toggle("hidden");
    darkMode.classList.toggle("hidden");
});