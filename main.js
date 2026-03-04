import './style.css'

const menu = document.getElementById("Menu")
const mobileMenu = document.getElementById("mobile-menu")
const ProjectDropDown = document.getElementById("ProjectDropDown")
const DropDownContent = document.getElementById("DropDownContent");

console.log(menu)
console.log(mobileMenu)
console.log(ProjectDropDown)
console.log(DropDownContent)


menu.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
})

ProjectDropDown.addEventListener("click", () => {
    DropDownContent.classList.toggle("hidden");
})