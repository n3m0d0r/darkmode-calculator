const visor = document.querySelector('.visor');
const numbersButtons = document.querySelectorAll('button[data-number]');
const operationButtons = document.querySelectorAll('button[data-operator]');
const dotButton = document.querySelector('button[data-option="dot"]');
const backSpaceButton = document.querySelector('button[data-option="backspace"]');
const clearButton = document.querySelector('button[data-option="clear"]');
const resultButton = document.querySelector('button[data-submit]');
const maxDecimals = 3;
let numberState = '';
let operationState = [];
visor.textContent = '';

backSpaceButton.addEventListener('click', () => {
  const visorContent = visor.textContent;
  if (visorContent === '') return;
  // check last entered. if number, delete last digit. if operation, remove that operation
  if (numberState) {
    numberState = numberState.length > 2 ? numberState.split('').slice(0,numberState.length-1) : '';
  } else if (operationState) {
    operationState = operationState.slice(0, operationState.length-1);
  }
  visor.textContent = visorContent.split('').slice(0,visorContent.length-1).join('');
});

dotButton.addEventListener('click', () => {
  //checks if numberState has at least one number and no dot
  if (!numberState) return;
  if (!numberState.match(/[0-9]/g)) return;
  if (numberState.match(/\./g)) return;
  numberState += '.';
  updateDisplay('.');
});

clearButton.addEventListener('click', () => { reset(); });

resultButton.addEventListener('click', () => {
  if (numberState === '' || operationState.length < 2) return;
  operationState.push(Number(numberState)); 
  while(operationState.length > 1) {
    const operation = operationState.splice(0, 3);
    const firstNum = operation[0];
    const operator = operation[1];
    const secondNum = operation[2];
    const result = operate(firstNum, secondNum, operator);
    if (result === Infinity) {
      setTimeout(() => reset(), 1000);
      replaceDisplay('sorry, i cannot calculate that... :(');
      operationState = [];
      numberState = '';
      return;
    }
    operationState.unshift(result);
    numberState = result;
  }
  let finalResult = operationState[0];
  if (finalResult.toString().length > maxDecimals) { 
    finalResult = finalResult.toFixed(maxDecimals);
  }
  replaceDisplay(finalResult);
  numberState = String(finalResult); 
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


