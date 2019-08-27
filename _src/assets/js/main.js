'use strict';

const button = document.querySelector('.btn__js');
const board = document.querySelector('.board_js');
const opt4 = document.querySelector('.opt_4Js');
const opt6 = document.querySelector('.opt_6Js');
const opt8 = document.querySelector('.opt_8Js');

function init(){
  localStorage.setItem('value', 4);
  if(localStorage.getItem('value')=== '4'){
    opt4.setAttribute('checked', true);
  }
  else if(localStorage.getItem('value')=== '6'){
    opt6.setAttribute('checked', true);
  }
  else if(localStorage.getItem('value')=== '8'){
    opt8.setAttribute('checked', true);
  }
  board.innerHTML='';
}

function show(event){
  const guiltyElement = event.currentTarget;
  const elementUrl = guiltyElement.getAttribute('dataUrl');
  guiltyElement.style.backgroundImage = `url(${elementUrl})`;
}

function createCard(url, pair){
  const newElement = document.createElement('li');
  newElement.classList.add('card');
  newElement.setAttribute('dataUrl', url);
  newElement.setAttribute('dataPair', pair);
  const backCardImage = 'https://via.placeholder.com/160x195/30d9c4/ffffff/?text=ADALAB';
  newElement.style.backgroundImage = `url(${backCardImage})`;
  board.appendChild(newElement);
  newElement.addEventListener('click', show);
}

function select(){
  const selectedDif = localStorage.getItem('value');
  fetch(`https://raw.githubusercontent.com/Adalab/cards-data/master/${selectedDif}.json`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      for (const item of data){
        createCard(item.image, item.pair);
      }
    });
  button.setAttribute('disabled', true);
}

function setvalue(event){
  const value = event.currentTarget.value;
  localStorage.setItem('value', value);
}

button.addEventListener('click', select);
opt4.addEventListener('click', setvalue);
opt6.addEventListener('click', setvalue);
opt8.addEventListener('click', setvalue);

init ();
