const ButtonKeys = [
    // Row 1
    { label: "xʸ", value: "Power", key: "^", type: "function", class: "btn-secondary" },
    { label: "π", value: "PI", key: "p", type: "constant", class: "btn-secondary" },
    { label: "e", value: "E", key: "e", type: "constant", class: "btn-secondary" },
    { label: "C", value: "Clear", key: "Escape", type: "control", class: "btn-danger" },
    { label: "⌫", value: "Backspace", key: "Backspace", type: "control", class: "btn-danger" },

    // Row 2
    { label: "√x", value: "Square Root", key: "r", type: "function", class: "btn-secondary" },
    { label: "1/x", value: "Reciprocal", key: "i", type: "function", class: "btn-secondary" },
    { label: "|x|", value: "Absolute Value", key: "a", type: "function", class: "btn-secondary" },
    { label: "exp", value: "Exponential", key: "x", type: "function", class: "btn-secondary" },
    { label: "mod", value: "%", key: "%", type: "operator", class: "btn-operator" },
    
    // Row 3
    { label: "x²", value: "Square", key: "q", type: "function", class: "btn-secondary" },
    { label: "(", value: "(", key: "(", type: "operator", class: "btn-secondary" },
    { label: ")", value: ")", key: ")", type: "operator", class: "btn-secondary" },
    { label: "n!", value: "Factorial", key: "!", type: "function", class: "btn-secondary" },
    { label: "÷", value: "/", key: "/", type: "operator", class: "btn-operator" },

    // Row 4
    { label: "log", value: "Logarithm", key: "l", type: "function", class: "btn-secondary" },
    { label: "7", value: "7", key: "7", type: "number", class: "btn-number" },
    { label: "8", value: "8", key: "8", type: "number", class: "btn-number" },
    { label: "9", value: "9", key: "9", type: "number", class: "btn-number" },
    { label: "×", value: "*", key: "*", type: "operator", class: "btn-operator" },

    // Row 5
    { label: "cos", value: "Cosine", key: "c", type: "function", class: "btn-secondary" },
    { label: "4", value: "4", key: "4", type: "number", class: "btn-number" },
    { label: "5", value: "5", key: "5", type: "number", class: "btn-number" },
    { label: "6", value: "6", key: "6", type: "number", class: "btn-number" },
    { label: "-", value: "-", key: "-", type: "operator", class: "btn-operator" },

    // Row 6
    { label: "sin", value: "Sine", key: "s", type: "function", class: "btn-secondary" },
    { label: "1", value: "1", key: "1", type: "number", class: "btn-number" },
    { label: "2", value: "2", key: "2", type: "number", class: "btn-number" },
    { label: "3", value: "3", key: "3", type: "number", class: "btn-number" },
    { label: "+", value: "+", key: "+", type: "operator", class: "btn-operator" },
    // Row 7
    { label: "tan", value: "Tangent", key: "t", type: "function", class: "btn-secondary" },
    { label: "+/-", value: "Negate", key: "n", type: "function", class: "btn-number" },
    { label: "0", value: "0", key: "0", type: "number", class: "btn-number" },
    { label: ".", value: ".", key: ".", type: "number", class: "btn-number" },
    { label: "=", value: "Equals", key: "Enter", type: "control", class: "btn-equals bg-(--btn-equals-bg) hover:bg-(--btn-equals-hover-bg)" }
];

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
function ShortcutItems(label, key) {
    const unorderedItem = document.createElement("ul");
    unorderedItem.className = "flex flex-col gap-4";
    unorderedItem.innerHTML = `<li class="flex justify-between gap-6 py-1">
                            <span>${label}</span>
                            <kbd class="bg-gray-700 px-2 py-0.5 rounded mr-4">${key}</kbd>
                        </li>`
    ShortcutBar.appendChild(unorderedItem);
}

ButtonKeys.forEach(btn => {
    ShortcutItems(btn.value, btn.key)
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

                case "Square Root":
                    expression += "Math.sqrt(";
                    break;

                case "Sine":
                    expression += "Math.sin(";
                    break;

                case "Cosine":
                    expression += "Math.cos(";
                    break;

                case "Tangent":
                    expression += "Math.tan(";
                    break;

                case "log":
                    expression += "Math.log10(";
                    break;

                case "Square":
                    expression += "**2";
                    break;

                case "Power":
                    expression += "**";
                    break;

                case "Absolute Value":
                    expression += "Math.abs(";
                    break;

                case "Reciprocal":
                    expression += "1/(";
                    break;

                case "Factorial":
                    expression += "!";
                    break;

                case "Negate":
                    expression = "-" + expression;
                    break;
            }
            break;

        case "control":
            switch (value) {

                case "Clear":
                    expression = "";
                    resultDisplay.textContent = "";
                    break;

                case "Backspace":
                    expression = expression.slice(0, -1);
                    break;

                case "Equals":
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