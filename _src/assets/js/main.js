'use strict';

const button = document.querySelector('.btn__js');
const board = document.querySelector('.board_js');
const opt4 = document.querySelector('.opt_4Js');
const opt6 = document.querySelector('.opt_6Js');
const opt8 = document.querySelector('.opt_8Js');
const backCardImage = 'https://via.placeholder.com/160x195/30d9c4/ffffff/?text=ADALAB';

function init(){
  localStorage.removeItem('pair');
  if(localStorage.getItem('value') === ''){
    opt4.setAttribute('checked', true);
    localStorage.setItem('value', 4);
  }
  else if(localStorage.getItem('value') === null){
    opt4.setAttribute('checked', true);
    localStorage.setItem('value', 4);
  }
  else if(localStorage.getItem('value') === undefined){
    opt4.setAttribute('checked', true);
    localStorage.setItem('value', 4);
  }
  else if(localStorage.getItem('value') === '4'){
    opt4.setAttribute('checked', true);
  }
  else if(localStorage.getItem('value') === '6'){
    opt6.setAttribute('checked', true);
  }
  else if(localStorage.getItem('value') === '8'){
    opt8.setAttribute('checked', true);
  }
  board.innerHTML='';
}
function comparePair(element, firstPair){
  const secondPair = element.getAttribute('dataPair');
  if(firstPair === secondPair){
    const pairArray = board.querySelectorAll(`[dataPair = '${firstPair}']`);
    for(const item of pairArray){
      item.classList.add('hidden');
    }
    localStorage.removeItem('pair');
  }
  else{
    element.setAttribute('disabled', true);
    const disabledLis = board.querySelectorAll(`[disabled = 'true']`);
    for(const item of disabledLis){
      const imgArray = item.querySelectorAll('.img');
      item.setAttribute('disabled', false);
      for (const item of imgArray){
        item.classList.toggle('hidden');
      }
    }
    localStorage.removeItem('pair');
  }
}
function checkPair(element){
  const firstPair = localStorage.getItem('pair');
  if(firstPair !== null){
    setTimeout(comparePair(element, firstPair),6000);
  }
  else{
    const choosedPair =element.getAttribute('dataPair');
    localStorage.setItem('pair', choosedPair);
    element.setAttribute('disabled', true);
  }
}
function show(event){
  const guiltyElement = event.currentTarget;
  const able = guiltyElement.getAttribute('disabled');
  if(able === 'false'){
    const imgArray = guiltyElement.querySelectorAll('.img');
    for (const item of imgArray){
      item.classList.toggle('hidden');
    }
    setTimeout(checkPair(guiltyElement),6000);
  }
}


function createCard(url, name, pair){
  const newElement = document.createElement('li');
  newElement.classList.add('card');
  newElement.setAttribute('dataUrl', url);
  newElement.setAttribute('dataPair', pair);
  newElement.setAttribute('disabled', false);
  const faceImage = document.createElement('img');
  faceImage.classList.add('img');
  faceImage.classList.add('hidden');
  faceImage.src = url;
  faceImage.alt = name;
  const tailImage = document.createElement('img');
  tailImage.classList.add('img');
  tailImage.src = backCardImage;
  tailImage.alt = 'default';
  newElement.appendChild(faceImage);
  newElement.appendChild(tailImage);
  board.appendChild(newElement);
  newElement.addEventListener('click', show);
}

function select(){
  const selectedDif = localStorage.getItem('value');
  const ENDPOINT = `https://raw.githubusercontent.com/Adalab/cards-data/master/${selectedDif}.json`;
  fetch(ENDPOINT)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      for (const item of data){
        createCard(item.image, item.name, item.pair);
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
