const ButtonKeys = [
    // Row 1
    { label: "xʸ", value: "pow", key: "^", type: "function", class: "btn-secondary", description:"Power" },
    { label: "π", value: "pi", key: "p", type: "constant", class: "btn-secondary", description:"Pi" },
    { label: "e", value: "e", key: "e", type: "constant", class: "btn-secondary", description:"Euler's Number" },
    { label: "C", value: "clear", key: "Escape", type: "control", class: "btn-danger", description:"Clear" },
    { label: "⌫", value: "backspace", key: "Backspace", type: "control", class: "btn-danger", description:"Backspace" },
    // Row 2
    { label: "√x", value: "sqrt", key: "r", type: "function", class: "btn-secondary", description:"Square Root" },
    { label: "1/x", value: "reciprocal", key: "i", type: "function", class: "btn-secondary", description:"Reciprocal" },
    { label: "|x|", value: "abs", key: "a", type: "function", class: "btn-secondary", description:"Absolute Value" },
    { label: "exp", value: "exp", key: "x", type: "function", class: "btn-secondary", description:"Exponential" },
    { label: "mod", value: "mod", key: "%", type: "operator", class: "btn-operator", description:"Modulo" },

    // Row 3
    { label: "x²", value: "square", key: "q", type: "function", class: "btn-secondary", description:"Square" },
    { label: "(", value: "(", key: "(", type: "operator", class: "btn-secondary", description:"Open Parenthesis" },
    { label: ")", value: ")", key: ")", type: "operator", class: "btn-secondary", description:"Close Parenthesis" },
    { label: "n!", value: "factorial", key: "!", type: "function", class: "btn-secondary", description:"Factorial" },
    { label: "÷", value: "/", key: "/", type: "operator", class: "btn-operator", description:"Division" },
    // Row 4
    { label: "log", value: "log", key: "l", type: "function", class: "btn-secondary", description:"Logarithm" },
    { label: "7", value: "7", key: "7", type: "number", class: "btn-number", description:"Number 7" },
    { label: "8", value: "8", key: "8", type: "number", class: "btn-number", description:"Number 8" },
    { label: "9", value: "9", key: "9", type: "number", class: "btn-number", description:"Number 9" },
    { label: "×", value: "*", key: "*", type: "operator", class: "btn-operator", description:"Multiplication" },

    // Row 5
    { label: "cos", value: "cos", key: "c", type: "function", class: "btn-secondary", description:"Cosine" },
    { label: "4", value: "4", key: "4", type: "number", class: "btn-number", description:"Number 4" },
    { label: "5", value: "5", key: "5", type: "number", class: "btn-number", description:"Number 5" },
    { label: "6", value: "6", key: "6", type: "number", class: "btn-number", description:"Number 6" },
    { label: "-", value: "-", key: "-", type: "operator", class: "btn-operator", description:"Subtraction" },

    // Row 6
    { label: "sin", value: "sin", key: "s", type: "function", class: "btn-secondary", description:"Sine" },
    { label: "1", value: "1", key: "1", type: "number", class: "btn-number", description:"Number 1" },
    { label: "2", value: "2", key: "2", type: "number", class: "btn-number", description:"Number 2" },
    { label: "3", value: "3", key: "3", type: "number", class: "btn-number", description:"Number 3" },
    { label: "+", value: "+", key: "+", type: "operator", class: "btn-operator", description:"Addition" },

    // Row 7
    { label: "tan", value: "tan", key: "t", type: "function", class: "btn-secondary", description:"Tangent" },
    { label: "+/-", value: "negate", key: "n", type: "function", class: "btn-number", description:"Negate" },
    { label: "0", value: "0", key: "0", type: "number", class: "btn-number", description:"Number 0" },
    { label: ".", value: ".", key: ".", type: "number", class: "btn-number", description:"Decimal Point" },
    { label: "=", value: "equals", key: "Enter", type: "control", class: "btn-equals bg-(--btn-equals-bg) hover:bg-(--btn-equals-hover-bg)", description:"Equals" },
]

// DOM Selectors
const buttonContainer = document.getElementById("btn-collection");
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const historyContainer = document.getElementById("history");
const DeleteHistory = document.getElementById("DeleteHistory");
const ShortcutBar = document.getElementById("shortcut-bar");
const ShortcutInfo = document.getElementById("shortcut-info");
const mblHistoryIcon = document.getElementById("mblhistory-icon");
const mblShortcutInfo = document.getElementById("mblshortcut-info");
const mblhistoryContainer = document.getElementById("history-container");
const keyboardShortcutsList = document.getElementById("keyboard-shortcuts");

// CALCULATOR STATE
var expression = "";
var result = "";

// ADD SHORTCUTS TO SIDEBAR
function ShortcutItems(description, key) {
    const unorderedItem = document.createElement("ul");
    unorderedItem.className = "flex flex-col gap-4";
    unorderedItem.innerHTML = `<li class="flex justify-between gap-6 py-1">
                            <span>${description}</span>
                            <kbd class="bg-gray-700 px-2 py-0.5 rounded mr-4">${key}</kbd>
                        </li>`
    ShortcutBar.appendChild(unorderedItem);
}

ButtonKeys.forEach(btn => {
    ShortcutItems(btn.description, btn.key)
});

// ADD BUTTONS TO BUTTON COLLECTION
function renderButtons() {
    ButtonKeys.forEach(btn => {
        const button = document.createElement("button");
        button.textContent = btn.label;
        button.className = `calc-btn ${btn.class}`;
        
        // Add data attributes for logic later
        button.dataset.value = btn.value;
        button.dataset.type = btn.type;
        button.dataset.key = btn.key;

        buttonContainer.appendChild(button);
    });
}

renderButtons();

// INPUT HANDLER
function handleInput(value, type) {

    switch (type) {

        case "number":
            expression += value;
            break;

        case "operator":
            expression += value;
            break;

        case "constant":
            if (value === "PI") expression += Math.PI;
            else if (value === "E") expression += Math.E;
            break;

        case "function":

            switch (value) {

                case "sqrt":
                    expression += "Math.sqrt(";
                    break;

                case "sin":
                    expression += "Math.sin(";
                    break;

                case "cos":
                    expression += "Math.cos(";
                    break;

                case "tan":
                    expression += "Math.tan(";
                    break;

                case "log":
                    expression += "Math.log10(";
                    break;

                case "square":
                    expression += "**2";
                    break;

                case "**":
                    expression += "**";
                    break;

                case "abs":
                    expression += "Math.abs(";
                    break;

                case "reciprocal":
                    expression += "1/(";
                    break;

                case "factorial":
                    expression += "!";
                    break;

                case "negate":
                    expression = "-" + expression;
                    break;
            }
            break;

        case "control":
            switch (value) {

                case "clear":
                    expression = "";
                    resultDisplay.textContent = "";
                    break;

                case "backspace":
                    expression = expression.slice(0, -1);
                    break;

                case "equals":
                    try {
                        if (expression.includes("!")) {
                            newExpression = expression.slice(1, 2);
                            const num = parseInt(newExpression);
                            let factorial = 1;
                            for (let i = 1; i <= num; i++) {
                                factorial *= i;
                            }
                            result = factorial;
                            resultDisplay.textContent = result;
                        }
                        else if (expression.includes("Math.sin(") || expression.includes("Math.cos(") || expression.includes("Math.tan(")) {
                            expression = expression.slice(0, -1);
                            let newExpression = expression + "*Math.PI/180)";
                            expression = expression + ")";
                            result = eval(newExpression);
                        } else {
                            result = eval(expression);
                        }
                        resultDisplay.textContent = result;
                        // Add to history
                        historyContainer.innerHTML += `<div class="text-right border-b border-gray-500/70 pb-2">
                        <div class="text-sm">${expression}</div>
                        <div class="text-lg text-gray-200">${result}</div>
                    </div>`

                    } catch {
                        resultDisplay.textContent = "Error";
                        expression = "";
                    }
                    break;
            }
            break;
    }
    updateDisplay();
}

// DISPLAY UPDATE EXPRESSION
function updateDisplay() {
    expressionDisplay.textContent = expression;
}

// CLICK EVENT
buttonContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const value = btn.dataset.value;
    const type = btn.dataset.type;

    handleInput(value, type);
});

// KEYBOARD EVENT
document.addEventListener("keydown", (e) => {
    const key = e.key;
    const button = ButtonKeys.find(btn => btn.key === key);

    if (!button) return;
    handleInput(button.value, button.type);
});

// Delete History Event
DeleteHistory.addEventListener("click", () => {
    historyContainer.innerHTML = "";
});

// Shortcut Bar Event
ShortcutInfo.addEventListener("click", () => {
    ShortcutBar.classList.toggle("right-[-125%]");
    ShortcutBar.classList.add("right-0");
});

// Mobile History Icon Event
mblHistoryIcon.addEventListener("click", () => {
    mblhistoryContainer.classList.toggle("right-[-120%]");
    mblhistoryContainer.classList.add("right-0");
});

// Mobile Shortcut Icon Event
mblShortcutInfo.addEventListener("click", () => {
    ShortcutBar.classList.toggle("right-[-125%]");
    ShortcutBar.classList.add("right-0");
});