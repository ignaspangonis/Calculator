// NOTE: the comments are written in Lithuanian,
// because that was required for the university assignment

class Calculator {
  constructor(previousText, currentText) {
    // Objekto Calculator laukams priskiriamos rodyklės į HTML elementus
    this.previousText = previousText;
    this.currentText = currentText;
    // Sukuriami dar 3 laukai su clear()
    this.clear();
  }

  updateScreen() {
    this.currentText.innerText = this.parseToString(this.currentNumber);
    if (this.operator == '̽√') { // jei šaknis, previousText vizualizuojam kitaip
      this.previousText.innerText =
        `√${this.parseToString(this.previousNumber)} by:`;
    } else if (this.operator != null) { // jei kitas operatorius, paprastai
      this.previousText.innerText =
        `${this.parseToString(this.previousNumber)} ${this.operator}`;
    } else {
      // jei nėra operatoriaus, ištriname previous text (jei toks išvis buvo)
      this.previousText.innerText = '';
    }
  }

  parseToString(currentNumber) {
    const stringNumber = currentNumber.toString();
    const integerPart = parseFloat(stringNumber.split('.')[0]);
    const decimalPart = stringNumber.split('.')[1];
    let integerDisplay;

    if (isNaN(integerPart)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerPart.toString();
    }

    // Grąžinti sveiką skaičių jei skaičius neturi dešimtainės dalies
    return decimalPart === null ? integerDisplay : `${integerDisplay}.${decimalPart}`;
  }

  clear() {
    this.currentNumber = '';
    this.previousNumber = '';
    this.operator = undefined;
  }

  delete() {
    // Dabartiniam skaičiui nukerpamas galas
    this.currentNumber = this.currentNumber.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentNumber.includes('.')) return; // neleidžiame pridėlioti daug '.'
    this.currentNumber = this.currentNumber.toString() + number.toString();
  }

  setOperator(operator) {
    if (this.currentNumber === '') return; // jei nėra current skaičiaus, nieko nedaryk
    if (this.previousNumber !== '') {
      this.calculate() // jei egzistuoja pirmas skaičius (vadinasi yra ir antras), skaičiuok atsakymą ir
    } // tada pridėk operatorių
    this.operator = operator; // set
  }

  moveCurrentToPrevious() {
    this.previousNumber = this.currentNumber; // numetam į previous
    this.currentNumber = ''; // išvalom current
  }

  calculate() {
    let result;
    const first = parseFloat(this.previousNumber);
    const second = parseFloat(this.currentNumber);

    if (isNaN(first) || isNaN(second)) return;

    switch (this.operator) { // atliekame veiksmą pagal operatorių
      case '+':
        result = first + second;
        break;
      case '-':
        result = first - second;
        break;
      case '×':
        result = first * second;
        break;
      case '÷':
        result = first / second;
        break;
      case '^':
        result = Math.pow(first, second);
        break;
      case '̽√':
        result = Math.pow(first, 1/second);
        break;
      default:
        break;
    }

    result = +result.toFixed(14);

    this.currentNumber = result;
    this.operator = undefined;
    this.previousNumber = '';
  }

  calculateInstant() {
    let result; // rezultatas
    const number = parseFloat(this.currentNumber); // įsivedame tik vieną skaičių

    if (isNaN(number)) return;

    switch (this.operator) {
      case '√':
        result = Math.pow(number, 1/2);
        break;
      case 'sin':
        result = Math.sin(number);
        break;
      case 'cos':
        console.log(number);
        result = Math.cos(number);
        break;
      case 'tan':
        result = Math.tan(number);
        break;
      case '~':
        result = Math.round(number);
        break;
      case 'ℼ':
        result = Math.PI * number;
        break;
      default:
        return;
    }

    result = +result.toFixed(14); // iki 14 dešimtainių skaitmenų

    this.currentNumber = result;
    this.operator = undefined;
    this.previousNumber = '';
  }  
}

// DOM selectors

const numbers = document.querySelectorAll('[data-number]');
const operators = document.querySelectorAll('[data-operator]');
const instantOperators = document.querySelectorAll('[data-instant-operator]'); // operatoriai, kurie vykdo iškart
const equals = document.querySelector('[data-equals]');
const del = document.querySelector('[data-delete]');
const allClear = document.querySelector('[data-clear]');
const previousText = document.querySelector('[data-previous-number]');
const currentText = document.querySelector('[data-current-number]');

const calculator = new Calculator(previousText, currentText);

// Event listeners

numbers.forEach(button => { // kiekvienam mygtukui iš masyvo
  button.addEventListener('click', () => {     // kai paspaudžia ant skaičiaus
    calculator.appendNumber(button.innerText); // prie dabartinio skaičiaus pridėk skaitmenį
    calculator.updateScreen();                 // atnaujink vaizdą
  })
})

operators.forEach(button => {
  button.addEventListener('click', () => {     // kai paspaudžia ant operatoriaus
    calculator.setOperator(button.innerText);  // nustatyk operatorių
    calculator.moveCurrentToPrevious();        // apatinį skaičių perkelk į viršų
    calculator.updateScreen();
  })
})

instantOperators.forEach(button => {
  button.addEventListener('click', () => {     // kai paspaudžia ant "instant" operatoriaus
    calculator.setOperator(button.innerText);
    calculator.calculateInstant();             // suskaičiuok nelaukdamas antro skaičiaus
    calculator.updateScreen();                 // atnaujink vaizdą
  })
})

equals.addEventListener('click', button => {
  calculator.calculate();
  calculator.updateScreen();
})

allClear.addEventListener('click', button => {
  calculator.clear();
  calculator.updateScreen();
})

del.addEventListener('click', button => {
  calculator.delete();
  calculator.updateScreen();
})
