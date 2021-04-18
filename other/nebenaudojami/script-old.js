
const compute = (_first, operator, _second) => {
  const first = parseFloat(_first); // returns a floating point number
  const second = parseFloat(_second);
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return first / second;
    case '^x':
      return Math.pow(first, second);
    case 'root-x':
      return Math.pow(first, 1/second);
  }
}
  
const getKeyType = key => {
    const { operator } = key.dataset; // destructing assignment: operator = key.dataset.operator
    if (!operator) return 'number'; // if no operator, it's number
    if (
      operator === '+' ||
      operator === '-' ||
      operator === '*' ||
      operator === '/' ||
      operator === "^x" ||
      operator === "root-x"
    ) return 'operator';
    // For everything else, return the operator
    return operator;
}
  
const createResultString = (key, oldSymbol, dataset) => {
    const newSymbol = key.textContent;
    const symbolType = getKeyType(key);
    console.log(dataset);
    // Assigning respective values from inside the state object
    const {
      firstValue,
      operator, // data-operator
      modValue,
      previousKeyType
    } = dataset; // from dataset
  
    // if number, show number
    if (symbolType === 'number') {
        // return condition ? true : false
        return oldSymbol === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === '='
        ? newSymbol : oldSymbol + newSymbol;
    }
    
    // if '.', show '.' or '0.'
    if (symbolType === 'decimal') {
      if (!oldSymbol.includes('.')) return oldSymbol + '.';
      if (previousKeyType === 'operator' || previousKeyType === '=') return '0.';
      return oldSymbol;
    }
  
    // if operator, calculate
    if (symbolType === 'operator') {
        return firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== '='
        ? compute(firstValue, operator, oldSymbol)
        : oldSymbol;
    }
  
    if (symbolType === 'clear') return 0
  
    if (symbolType === '=') {
      return firstValue
        ? previousKeyType === '='
          ? compute(oldSymbol, operator, modValue)
          : compute(firstValue, operator, oldSymbol)
        : oldSymbol;
    }
}
  
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key);
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = calculator.dataset;
  
    calculator.dataset.previousKeyType = keyType;
  
    if (keyType === 'operator') {
      calculator.dataset.operator = key.dataset.operator;
      calculator.dataset.firstValue = firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== '='
        ? calculatedValue // true
        : displayedNum; // false
    }
  
    if (keyType === '=') {
      calculator.dataset.modValue = firstValue && previousKeyType === '='
        ? modValue // true
        : displayedNum; // false
    }
  
    if (keyType === 'clear' && key.textContent === 'AC') {
      // Refresh data
      calculator.dataset.firstValue = '';
      calculator.dataset.modValue = '';
      calculator.dataset.operator = '';
      calculator.dataset.previousKeyType = '';
    }
}
  
const updateDisplay = (key, calculator) => {
  const keyType = getKeyType(key); // what is the type of key?
  // Array.from() static method creates a new Array instance
  // Removes 'pressed' from all keys:
  Array.from(key.parentNode.children).forEach(x => x.classList.remove('pressed'));
  if (keyType === 'operator') key.classList.add('pressed'); // add pressed
}
  
// Assigning variables
const calculator = document.querySelector('.calculator');
const screen = calculator.querySelector('.screen');
const keys = calculator.querySelector('.keys');
  
keys.addEventListener('click', e => {
  // Target - element that triggered the event.
  // matches() checks if that element would be selected by 'button' (boolean)
  if (!e.target.matches('button')) return;
  const key = e.target; // element is key, so assigning it to 'key' variable
  const displayedNum = screen.textContent; // text of key is number
  // dataset exposes a map of strings (DOMStringMap) with an entry for each data-* attribute.
  const resultString = createResultString(key, displayedNum, calculator.dataset);
  
  screen.textContent = resultString; // screen content is result
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateDisplay(key, calculator);
})


  