const createResultString = (key, oldSymbol, dataset) => {
  const newSymbol = key.textContent;
}

// Assigning variables
const calculator = document.querySelector('.calculator');
const screen = calculator.querySelector('.screen');
const keys = calculator.querySelector('.keys');
  
keys.addEventListener('click', e => {
  // Target - element that triggered the event.
  // matches() checks if that element would be selected by 'button' (boolean)
  if (!e.target.matches('button')) return; // if the clicked wasn't button, ignore
  const key = e.target; // target is the key element, so assigning it to 'key' variable
  const oldSymbol = screen.textContent; // text of key is number
  // dataset exposes a map of strings (DOMStringMap) with an entry for each data-* attribute.
  const resultString = createResultString(key, oldSymbol, calculator.dataset);
  
  screen.textContent = resultString; // screen content is result
  updateCalculatorState(key, calculator, resultString, oldSymbol);
  updateDisplay(key, calculator);
})
  