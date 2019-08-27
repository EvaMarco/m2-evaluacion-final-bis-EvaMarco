'use strict';

const button = document.querySelector('.btn__js');
const board = document.querySelector('.board_js');
const opt4 = document.querySelector('.opt_4Js');
const difArray = document.querySelectorAll('.dif__option');
const backCardImage = 'https://via.placeholder.com/160x195/30d9c4/ffffff/?text=ADALAB';

function init(){
  opt4.setAttribute('checked', true);
  localStorage.setItem('value', 4);
  board.innerHTML='';
  if(localStorage.getItem('pair') !==null){
    localStorage.removeItem('pair');
  }
}
function setDifficulty(event){
  const selectedOpt = event.currentTarget;
  selectedOpt.setAttribute('checked', true);
  localStorage.setItem('value', selectedOpt.value);
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
  newElement.addEventListener('click', showCard);
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

function showCard(event){
  const selectedCard = event.currentTarget;
  const disabled = selectedCard.getAttribute('disabled');
  if(disabled === 'false'){
    const imgArray = selectedCard.querySelectorAll('.img');
    for (const item of imgArray){
      item.classList.toggle('hidden');
    }
  }
  checkPair(selectedCard);
}

function startGame(){
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

button.addEventListener('click', startGame);
for (const item of difArray){
  item.addEventListener('click', setDifficulty);
}

init ();
