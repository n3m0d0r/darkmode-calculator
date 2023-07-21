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

window.addEventListener('keydown', e => handleKeyCode(e));

numbersButtons.forEach(button => button.addEventListener('click', e => handleNumberButton(e.target.attributes['data-number'].value)));

operationButtons.forEach(button => button.addEventListener('click', e => handleOperationButton(e.target.attributes['data-operator'].value)));

clearButton.addEventListener('click', () => reset());

resultButton.addEventListener('click', () => handleResultButton());

dotButton.addEventListener('click', () => handleDotButton());

backSpaceButton.addEventListener('click', () => handleBackSpaceButton());

function handleKeyCode(e) {
  const keycodes = {
    '48': '0',
    '49': '1',
    '50': '2',
    '51': '3',
    '52': '4',
    '53': '5',
    '54': '6',
    '55': '7',
    '56': '8',
    '57': '9',
    '8': 'backspace',
    '13': 'enter',
    '106': 'multiply',
    '107': 'add',
    '109': 'subtract',
    '110': 'dot',
    '111': 'divide'
  }
  const keycode = e.keyCode;
  if (keycode in keycodes) {
    e.preventDefault();
    switch (keycodes[keycode]) {
      case 'enter':
        handleResultButton();
        break;
      case 'backspace':
        handleBackSpaceButton();
        break;
      case 'multiply':
        handleOperationButton('multiply');
        break;
      case 'add':
        handleOperationButton('add');
        break;
      case 'subtract':
        handleOperationButton('subtract');
        break;
      case 'divide':
        handleOperationButton('divide');
        break;
      case 'dot':
        handleDotButton();
        break;
      default:
        handleNumberButton(keycodes[keycode]);
        break;
    }
  }
}

function handleBackSpaceButton() {
  const visorContent = visor.textContent;
  if (visorContent === '') return;
  // check last entered. if number, delete last digit. if operation, remove that operation
  if (numberState) {
    numberState = numberState.length > 2 ? numberState.split('').slice(0,numberState.length-1).join('') : '';
  } else if (operationState) {
    operationState = operationState.slice(0, operationState.length-1);
  }
  visor.textContent = visorContent.split('').slice(0,visorContent.length-1).join('');
}

function handleDotButton() {
  //checks if numberState has at least one number and no dot
  if (!numberState) return;
  if (!numberState.match(/[0-9]/g)) return;
  if (numberState.match(/\./g)) return;
  numberState += '.';
  updateDisplay('.');
}

function handleResultButton() {
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
  }
  let finalResult = Number(operationState[0]);
  if (finalResult.toString().length > maxDecimals) { 
    finalResult = finalResult.toFixed(maxDecimals);
  }
  replaceDisplay(finalResult);
  numberState = String(finalResult); 
  operationState = [numberState];
}

function reset() {
  operationState = [];
  visor.textContent = '';
  numberState = '';
}

function replaceDisplay(value) {
  visor.textContent = value;
}

function handleNumberButton(value) {
  numberState += value;
  updateDisplay(value);
}

function handleOperationButton(operationName) {
  const operations = {
    'add': '+',
    'multiply': '×',
    'divide': '÷',
    'subtract': '-'
  }
  if (!numberState) return; 
  operationState.push(Number(numberState)); 
  numberState = ''; 
  operationState.push(operationName);
  updateDisplay(operations[operationName]); 
}


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


