
const calculate = (_first, operator, _second) => {
    const first = parseFloat(_first); // returns a floating point number
    const second = parseFloat(_second);
    if (operator === '+') return first + second;
    if (operator === '-') return first - second;
    if (operator === '*') return first * second;
    if (operator === '/') return first / second;
}
  
const getKeyType = key => {
    const { operator } = key.dataset // destructing assignment: operator = key.dataset.operator
    if (!operator) return 'number' // if no operator, its number
    if (
      operator === '+' ||
      operator === '-' ||
      operator === '*' ||
      operator === '/'
    ) return 'operator'
    // For everything else, return the operator
    return operator
}
  
const createResultString = (key, symbol, dataset) => {
    const keyContent = key.textContent;
    const keyType = getKeyType(key);
    // Assigning respective values from inside the state object
    const {
      firstValue,
      operator, // data-operator
      modValue,
      previousKeyType
    } = dataset; // from dataset
  
    // If key is number
    if (keyType === 'number') {
        // return condition ? true : false
        return symbol === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === '='
        ? keyContent : symbol + keyContent;
    }
  
    if (keyType === 'decimal') {
      if (!symbol.includes('.')) return symbol + '.';
      if (previousKeyType === 'operator' || previousKeyType === '=') return '0.';
      return symbol;
    }
  
    if (keyType === 'operator') {
        return firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== '='
        ? calculate(firstValue, operator, symbol)
        : symbol
    }
  
    if (keyType === 'clear') return 0
  
    if (keyType === '=') {
      return firstValue
        ? previousKeyType === '='
          ? calculate(symbol, operator, modValue)
          : calculate(firstValue, operator, symbol)
        : symbol
    }
}
  
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key)
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = calculator.dataset
  
    calculator.dataset.previousKeyType = keyType
  
    if (keyType === 'operator') {
      calculator.dataset.operator = key.dataset.operator
      calculator.dataset.firstValue = firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== '='
        ? calculatedValue
        : displayedNum
    }
  
    if (keyType === '=') {
      calculator.dataset.modValue = firstValue && previousKeyType === '='
        ? modValue
        : displayedNum
    }
  
    if (keyType === 'clear' && key.textContent === 'AC') {
      calculator.dataset.firstValue = ''
      calculator.dataset.modValue = ''
      calculator.dataset.operator = ''
      calculator.dataset.previousKeyType = ''
    }
}
  
const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key); // what is the type of key?
  // Array.from() static method creates a new Array instance
  // Removes 'is-depressed' from all keys:
  Array.from(key.parentNode.children).forEach(x => x.classList.remove('is-depressed'));
  if (keyType === 'operator') key.classList.add('is-depressed'); // add is-depressed
}
  
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
  console.log(calculator.dataset)
  const resultString = createResultString(key, displayedNum, calculator.dataset);
  
  screen.textContent = resultString; // screen content is result
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
})
  