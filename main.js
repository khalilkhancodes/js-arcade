import './style.css'

// Menu and Dropdown Elements
const menuBtn = document.getElementById("Menu");
const mobileMenu = document.getElementById("mobile-menu");
const projectDropDownBtn = document.getElementById("ProjectDropDown");
const dropDownContent = document.getElementById("DropDownContent");
const dropDownIcon = projectDropDownBtn.querySelector("i");

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
// Check for saved theme in localStorage
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    body.classList.add('darkmode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('darkmode');

    if (body.classList.contains('darkmode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Toggle Mobile Menu
menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Toggle Mobile Dropdown for Projects
projectDropDownBtn.addEventListener("click", () => {
    dropDownContent.classList.toggle("hidden");

    // Rotate the icon
    if (dropDownContent.classList.contains("hidden")) {
        dropDownIcon.style.transform = "rotate(0deg)";
    } else {
        dropDownIcon.style.transform = "rotate(180deg)";
    }
});