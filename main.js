import './style.css'

// Menu and Dropdown Elements
const menuBtn = document.getElementById("Menu");
const mobileMenu = document.getElementById("mobile-menu");
const projectDropDownBtn = document.getElementById("ProjectDropDown");
const dropDownContent = document.getElementById("DropDownContent");
const dropDownIcon = projectDropDownBtn.querySelector("i");

// Projects Data
const projectsGrid = document.getElementById("projectsGrid");

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
// Check for saved theme in localStorage
const currentTheme = localStorage.getItem('theme');

// Tech Data
const techStack = document.getElementById("techStack");

// Laptop ProjectDropDownContent
const mdProjectDropDownContent = document.getElementById("mdProjectDropDownContent");

// Mobile ProjectDropDownContent
const projectDropDownContent = document.getElementById("projectDropDownContent");

const Projects = [
    {
        icon: "ph-fill ph-calculator",
        title: "Calculator",
        description: "Dynamic Calculator with Real-time Display and Comprehensive Functionality",
        explore: "Explore Implementation",
        exploreLink: "projects/calculator/index.html",
    },
    {
        icon: "ph-fill ph-clock",
        title: "Clock Timer",
        description: "Precision Interval Timer with Start, Stop, and Reset Functionality",
        explore: "Explore Implementation",
        exploreLink: "projects/clock-timer/index.html",
    },
    
    {
        icon: "ph-fill ph-hash",
        title: "Counter App",
        description: "Interactive Counter App with Increment, Decrement, and Reset Functionality",
        explore: "Explore Implementation",
        exploreLink: "projects/counter-app/index.html",
    },
    {
        icon: "ph-fill ph-cloud-sun",
        title: "Weather App",
        description: "Real-time Weather Forecasting with Dynamic UI and Geolocation",
        explore: "Explore Implementation",
        exploreLink: "projects/weather-app/index.html",
    },
    {
        icon: "ph-fill ph-question",
        title: "Quiz Master",
        description: "Interactive Quiz Application with Multiple Question Types and Scoring System",
        explore: "Explore Implementation",
        exploreLink: "projects/quiz-master/index.html",
    },
    {
        icon: "ph-fill ph-grid-nine",
        title: "Tic Tac Toe",
        description: "Classic Tic Tac Toe Game with Interactive Gameplay and Score Tracking",
        explore: "Explore Implementation",
        exploreLink: "projects/tic-tac-toe/index.html",
    },
    {
        icon: "ph-fill ph-image",
        title: "Image Editor",
        description: "Simple Image Editing Application with Basic Tools and Effects",
        explore: "Explore Implementation",
        exploreLink: "projects/image-editor/index.html",
    },
    {
        icon: "ph-fill ph-play-circle",
        title: "Audio Player",
        description: "Simple Audio Player with Play, Pause, and Volume Control",
        explore: "Explore Implementation",
        exploreLink: "projects/audio-player/index.html",
    },
    {
        icon: "ph-fill ph-code",
        title: "More Coming ...",
        description:"Suggest an idea on github",
        explore: ""
    }
]

const techStackData = ["DOM Manipulation", "Web Storage", "Async/Await", "Fetch API", "Event Listeners", "LocalStorage", "CSS Grid/Flex", "Responsive Design"];

techStackData.forEach(tech => {
    techStack.innerHTML += `<span class="px-5 py-2.5 bg-(--white) border border-gray-200 rounded-full text-sm font-semibold text-(--primaryText) shadow-sm">${tech}</span>`;
});

Projects.forEach(project => {
    mdProjectDropDownContent.innerHTML += `<a href="${project.exploreLink}" class="px-4 py-2 hover:text-(--AccentElements) transition-colors">${project.title}</a>`;
})

Projects.forEach(project => {
    projectDropDownContent.innerHTML += `<a href="${project.exploreLink}" class="block px-8 py-3 hover:text-(--AccentElements)">${project.title}</a>`;
})

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

Projects.map(project => {
    projectsGrid.innerHTML += `
    <article class="bg-(--white) p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div class="w-12 h-12 bg-blue-50 text-(--AccentElements)  rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
            <i class="${project.icon}"></i>
        </div>
        <h3 class="text-xl font-bold text-(--primaryText) mb-2">${project.title}</h3>
        <p class="text-(--paragraphColor) text-sm mb-6 grow leading-relaxed">
        ${project.description}</p>
        <div class="flex items-center space-x-2 text-(--AccentElements) font-medium group-hover:text-blue-600">
            <a href="${project.exploreLink}" target="_blank" class="flex items-center space-x-2">
            <span class="text-sm">${project.explore}</span>
            <i class="ph-bold ph-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
            </a>
        </div>
    </article>`
})

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