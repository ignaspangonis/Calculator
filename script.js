class Calculator {
  constructor(previousText, currentText) {
    this.previousText = previousText;
    this.currentText = currentText;
    this.currentNumber = "";
    this.previousNumber = "";
    this.operator = undefined;
  }

  updateScreen() {
    this.currentText.innerText = this.parseToString(this.currentNumber);

    if (this.operator == "̽√") {
      this.previousText.innerText = `√${this.parseToString(
        this.previousNumber
      )} by:`;
    } else if (this.operator != null) {
      this.previousText.innerText = `${this.parseToString(
        this.previousNumber
      )} ${this.operator}`;
    } else {
      this.previousText.innerText = "";
    }
  }

  parseToString(currentNumber) {
    const stringNumber = currentNumber.toString();
    const integerPart = parseFloat(stringNumber.split(".")[0]);
    const decimalPart = stringNumber.split(".")[1];
    let integerDisplay;

    if (isNaN(integerPart)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerPart.toString();
    }

    return [null, undefined].includes(decimalPart)
      ? integerDisplay
      : `${integerDisplay}.${decimalPart}`;
  }

  clear() {
    this.currentNumber = "";
    this.previousNumber = "";
    this.operator = undefined;
  }

  delete() {
    this.currentNumber = this.currentNumber.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currentNumber.includes(".")) return;
    this.currentNumber = this.currentNumber.toString() + number.toString();
  }

  setOperator(operator) {
    if (this.currentNumber === "") return;
    if (this.previousNumber !== "") {
      this.calculate();
    }
    this.operator = operator;
  }

  moveCurrentToPrevious() {
    this.previousNumber = this.currentNumber;
    this.currentNumber = "";
  }

  calculate() {
    let result;
    const first = parseFloat(this.previousNumber);
    const second = parseFloat(this.currentNumber);

    if (isNaN(first) || isNaN(second)) return;

    switch (this.operator) {
      case "+":
        result = first + second;
        break;
      case "-":
        result = first - second;
        break;
      case "×":
        result = first * second;
        break;
      case "÷":
        result = first / second;
        break;
      case "^":
        result = Math.pow(first, second);
        break;
      case "̽√":
        result = Math.pow(first, 1 / second);
        break;
      default:
        break;
    }

    result = Number(result.toFixed(14));

    this.currentNumber = result;
    this.operator = undefined;
    this.previousNumber = "";
  }

  calculateInstant() {
    let result;
    const number = parseFloat(this.currentNumber);

    if (isNaN(number)) return;

    switch (this.operator) {
      case "√":
        result = Math.pow(number, 1 / 2);
        break;
      case "sin":
        result = Math.sin(number);
        break;
      case "cos":
        console.log(number);
        result = Math.cos(number);
        break;
      case "tan":
        result = Math.tan(number);
        break;
      case "~":
        result = Math.round(number);
        break;
      case "ℼ":
        result = Math.PI * number;
        break;
      default:
        return;
    }

    result = +result.toFixed(14);

    this.currentNumber = result;
    this.operator = undefined;
    this.previousNumber = "";
  }
}

// DOM selectors

const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const instantOperators = document.querySelectorAll("[data-instant-operator]");
const equals = document.querySelector("[data-equals]");
const del = document.querySelector("[data-delete]");
const allClear = document.querySelector("[data-clear]");
const previousText = document.querySelector("[data-previous-number]");
const currentText = document.querySelector("[data-current-number]");

const calculator = new Calculator(previousText, currentText);

// Event listeners

numbers.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateScreen();
  });
});

operators.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.setOperator(button.innerText);
    calculator.moveCurrentToPrevious();
    calculator.updateScreen();
  });
});

instantOperators.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.setOperator(button.innerText);
    calculator.calculateInstant();
    calculator.updateScreen();
  });
});

equals.addEventListener("click", () => {
  calculator.calculate();
  calculator.updateScreen();
});

allClear.addEventListener("click", () => {
  calculator.clear();
  calculator.updateScreen();
});

del.addEventListener("click", () => {
  calculator.delete();
  calculator.updateScreen();
});
