// Theme
const themeToggle = document.querySelector(".themes__toggle");

const switchTheme = () => {
  themeToggle.classList.toggle("themes__toggle--isActive");
};

themeToggle.addEventListener("click", switchTheme);
themeToggle.addEventListener("keydown", (event) => event.key === "Enter" && switchTheme());

// logic for calculator
let storedNumber = ""
let currentNumber = ""
let operation = ""

const resultSpace = document.querySelector(".calc__result");
const keyElements = document.querySelectorAll(".calc__key");

const showOperation=(oldValue,op)=>{
  const verbose=`<span class="show__operation">${oldValue}${op}</span>`;
  resultSpace.insertAdjacentHTML("afterbegin",verbose);
}

const showFullOperation=(number,oldNumber)=>{
  const verbose=`<span class="show__operation">${oldNumber} ${operation} ${number}</span>`;
  resultSpace.insertAdjacentHTML("afterbegin",verbose);
}

const updateScreen = (value) => {
  resultSpace.textContent = !value ? "0" : value;
}

const numberHandler = (keyValue) => {
  if (keyValue === "." && currentNumber.includes(".")) {
    return;
  } else if (keyValue === ".") {
    if (!currentNumber) {
      currentNumber = "0";
    }
  }
  if (keyValue === "0" && ((!currentNumber || currentNumber === "0") && !operation)) return;
  currentNumber += keyValue;
  updateScreen(currentNumber);
  showOperation(storedNumber,operation);
}

const resetHandler = () => {
  operation = ""
  storedNumber = ""
  currentNumber = "";
  updateScreen(currentNumber)
}

const deleteHandler = () => {
  currentNumber = currentNumber.substring(0, currentNumber.length - 1);
  updateScreen(currentNumber);
}

const executeOperation = () => {
  if (currentNumber && storedNumber && operation) {
    switch (operation) {
      case "+":
        storedNumber = parseFloat(storedNumber) + parseFloat(currentNumber);
        break;
      case "-":
        storedNumber = parseFloat(storedNumber) - parseFloat(currentNumber);
        break;
      case "*":
        storedNumber = parseFloat(storedNumber) * parseFloat(currentNumber);
        break;
      default:
        storedNumber = parseFloat(storedNumber) / parseFloat(currentNumber);
        if(storedNumber===Infinity){
          updateScreen("Cannot divide by zero");
          storedNumber="";
          return
        }
        break;
    }
    currentNumber = "";
    updateScreen(storedNumber)
    showOperation(storedNumber,operation);
  }
}

const operationHandler = (operationValue) => {
  const existeSpan=document.querySelector(".show__operation");
  if (!storedNumber && !currentNumber) return;
  if (currentNumber && (!storedNumber || storedNumber === 0)) {
    storedNumber = currentNumber;
    currentNumber = "";
    operation = operationValue;
    if(existeSpan){
      existeSpan.remove();
    }
    showOperation(storedNumber,operation);
    return;
  } else if (storedNumber) {
    if (currentNumber) {
      if(existeSpan){
        existeSpan.remove();
      }
      showOperation(storedNumber,operation);
      executeOperation()
    }
    operation = operationValue;
    
    if(document.querySelector(".show__operation")){
      document.querySelector(".show__operation").remove()
    }
    showOperation(storedNumber,operation);
    return;
  }
  
}

const keyHandler = (key) => {
  key.addEventListener(
    "click",
    () => {
      if (key.dataset.type === "number") {
        numberHandler(key.dataset.value)
      } else if (key.dataset.type === "operation") {
        switch (key.dataset.value) {
          case "c":
            resetHandler();
            break;
          case "Backspace":
            deleteHandler()
            break;
          case "Enter":
            const tempCurrentNumber=currentNumber;
            const tempStoredNumber=storedNumber;
            executeOperation();
            if(document.querySelector(".show__operation")){
              document.querySelector(".show__operation").remove()
            }
            showFullOperation(tempCurrentNumber,tempStoredNumber);
            operation="";
            break;
          default:
            operationHandler(key.dataset.value)
        }
      }
    },
  )
}
keyElements.forEach(keyHandler)

// keyboard accessibility
const availableNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const availableOperations = ["+", "-", "*", "/"];
const availableKeys = [...availableNumbers, ...availableOperations, "Enter", "c", "Backspace"];

const keyboardKeysHandler = (event) => {
  if (availableNumbers.includes(event.key)) {
    numberHandler(event.key);
  } else if (availableOperations.includes(event.key)) {
    operationHandler(event.key)
  } else if (event.key === "=" || event.key === "Enter") {
    executeOperation()
  } else if (event.key === "Backspace") {
    deleteHandler();
  } else if (event.key === "c") {
    resetHandler()
  }
}

const keyboradHoverKeys = (key) => {
  if (availableKeys.includes(key)) {
    const hoveredElement = document.querySelector(`[data-value="${key}"]`);
    hoveredElement.classList.add("hover");
    setTimeout(() => {
      hoveredElement.classList.remove("hover");
    }, 200)
  }
}

window.addEventListener("keydown", (event) => {
  keyboardKeysHandler(event);
  keyboradHoverKeys(event.key);
})
