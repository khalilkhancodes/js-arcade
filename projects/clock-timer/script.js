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

startBtn.addEventListener("click", () => {
    startBtn.classList.replace("ph-bold", "ph-fill");
    pauseBtn.classList.replace("ph-fill", "ph-bold");
    resetBtn.classList.replace("ph-fill", "ph-bold");
    startTimer();
});
pauseBtn.addEventListener("click", () => {
    pauseBtn.classList.replace("ph-bold", "ph-fill");
    startBtn.classList.replace("ph-fill", "ph-bold");
    pauseTimer();
});
resetBtn.addEventListener("click", () => {
    resetBtn.classList.replace("ph-bold", "ph-fill");
    pauseBtn.classList.replace("ph-fill", "ph-bold");
    resetTimer();
});


let totalSeconds = 0;
let intervalId = null;


function formatTime(seconds) {
  const h = Math.floor(seconds / 3600) % 24;
  const m = Math.floor((seconds / 60) % 60);
  const s = seconds % 60;

  const displayHours = String(h).padStart(2, '0');
  const displayMinutes = String(m).padStart(2, '0');
  const displaySeconds = String(s).padStart(2, '0');

  return `${displayHours}:${displayMinutes}:${displaySeconds}`;
}

function startTimer() {
  if (intervalId !== null) return;

  intervalId = setInterval(() => {
    totalSeconds++;
    timeDisplay.textContent = formatTime(totalSeconds);
  }, 1000);
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  totalSeconds = 0;
  timeDisplay.textContent = "00:00:00";
}