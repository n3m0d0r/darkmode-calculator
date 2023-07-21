const visor = document.querySelector('.visor');
const numbersButtons = document.querySelectorAll('button[data-number]');
const operationButtons = document.querySelectorAll('button[data-operator]');
const dotButton = document.querySelector('button[data-option="dot"]');
const clearButton = document.querySelector('button[data-option="clear"]');
const resultButton = document.querySelector('button[data-submit]');
let numberState = '';
let operationState = [];
visor.textContent = '';

dotButton.addEventListener('click', () => {
  //checks if numberstate has at least one number and no dot
  if (!numberState) return;
  if (!numberState.match(/[0-9]/g)) return;
  if (numberState.match(/\./g)) return;
  numberState += '.';
  updateDisplay('.');
});

clearButton.addEventListener('click', () => { reset(); });

resultButton.addEventListener('click', e => {
  if (numberState === '' || operationState.length < 2) return;
  operationState.push(Number(numberState)); 
  const firstNum = operationState[0];
  const operator = operationState[1];
  const secondNum = operationState[2];
  const result = operate(firstNum, secondNum, operator);
  replaceDisplay(result);
  numberState = String(result); 
  operationState = [];
})

function reset() {
  operationState = [];
  visor.textContent = '';
  numberState = '';
}

function replaceDisplay(value) {
  visor.textContent = value;
}

numbersButtons.forEach(button => button.addEventListener('click', e => {
  const value = e.target.attributes['data-number'].value;
  numberState += value;
  updateDisplay(value);
}));

operationButtons.forEach(button => button.addEventListener('click', e => {
  if (!numberState) return; 
  operationState.push(Number(numberState)); 
  numberState = ''; 
  const operationName = e.target.attributes['data-operator'].value;
  operationState.push(operationName);
  updateDisplay(button.textContent); 
}));


function updateDisplay(value) {
  visor.textContent += value;  
}

function add(n1, n2) {
  return n1 + n2;
}

function subtract(n1, n2) {
  return n1 - n2;
}

function multiply(n1, n2) {
  return n1 * n2;
}

function divide(n1, n2) {
  return n1 / n2;
}

function operate(n1, n2, operator) {
  console.log(operationState);
  switch (operator) {
    case 'add':
      return add(n1, n2);
    case 'subtract':
      return subtract(n1, n2);
    case 'multiply':
      return multiply(n1, n2);
    case 'divide':
      return divide(n1, n2);
    default:
      return 'ERROR';
  }
}


