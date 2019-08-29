'use strict';

const button = document.querySelector('.btn__js');
const board = document.querySelector('.board_js');
const text = document.querySelector('.result__textJs');
const opt4 = document.querySelector('.opt_4Js');
const difArray = document.querySelectorAll('.dif__option');
const backCardImage = 'assets/images/pokemon-logo.png';
let counter = 0;
let cardsArray = [];

function init() {
  opt4.setAttribute('checked', true);
  localStorage.setItem('value', 4);
  board.innerHTML = '';
  if (localStorage.getItem('pair') !== null) {
    localStorage.removeItem('pair');
  }
}
function setDifficulty(event) {
  const selectedOpt = event.currentTarget;
  selectedOpt.setAttribute('checked', true);
  localStorage.setItem('value', selectedOpt.value);
}

function checkWin() {
  const storedValue = parseInt(localStorage.getItem('value'));
  if (counter === storedValue) {
    text.innerHTML = '¡Has ganado!';
    button.removeAttribute('disabled');
    counter = 0;
    board.innerHTML = '';
    cardsArray = [];
  }
}
const checkPair = (element) => {
  const firstPair = localStorage.getItem('pair');
  if (firstPair !== null) {
    const secondPair = element.getAttribute('dataPair');
    if (firstPair === secondPair) {
      const pairArray = board.querySelectorAll(`[dataPair = '${firstPair}']`);
      for (const item of pairArray) {
        item.classList.add('noVisibility');
      }
      localStorage.removeItem('pair');
      text.innerHTML = '¡Has encontrado una pareja!';
      counter += 2;

    }
    else {
      text.innerHTML = 'No son iguales';
      element.setAttribute('disabled', true);
      const disabledLis = board.querySelectorAll(`[disabled = 'true']`);
      for (const item of disabledLis) {
        const imgArray = item.querySelectorAll('.img');
        item.setAttribute('disabled', false);
        for (const item of imgArray) {
          item.classList.toggle('hidden');
        }
      }
      localStorage.removeItem('pair');
    }
    setTimeout(checkWin, 300);
  }
  else {
    const choosedPair = element.getAttribute('dataPair');
    localStorage.setItem('pair', choosedPair);
    element.setAttribute('disabled', true);
  }
};

function showCard(event) {
  text.innerHTML = '';
  const selectedCard = event.currentTarget;
  const disabled = selectedCard.getAttribute('disabled');
  if (disabled === 'false') {
    selectedCard.setAttribute('disabled', true);
    const imgArray = selectedCard.querySelectorAll('.img');
    for (const item of imgArray) {
      item.classList.toggle('hidden');
    }
    setTimeout(checkPair, 1000, selectedCard);
  }
}
function createCard(url, name, pair) {
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
  //cardsArray.push(newElement);
}
function startGame() {
  const selectedDif = localStorage.getItem('value');
  const ENDPOINT = `https://pokeapi.co/api/v2/pokemon/`;
  fetch(ENDPOINT)
    .then(response => response.json())
    .then(data => {
      const cards = [];
      const selectedCards = [];
      for (let i = 0; i <= (selectedDif - 1) / 2; i++) {
        let item = data.results[Math.floor(Math.random() * data.results.length)];
        cards.push(item);
        const index = data.results.indexOf(item);
        data.results.splice(index, 1);
      }
      const promises = [];
      const createPromise = (url) =>
        fetch(url)
          .then(response => response.json());
      for (const item of cards) {
        const promise = createPromise(item.url);
        promises.push(promise);
      }
      Promise.all(promises)
        .then(data => {
          for (const item of data){
            const backImage = item.sprites.back_default;
            const frontImage = item.sprites.front_default;
            const name = item.name;
            const pair = item.id;
            const pokemon = {
              'image': backImage,
              'name': name,
              'pair': pair
            };
            const pokemon2 = {
              'image': frontImage,
              'name': name,
              'pair': pair
            };
            selectedCards.push(pokemon);
            selectedCards.push(pokemon2);

            for (const item2 of selectedCards){
              const cardImage = item2.image;
              const cardName = item2.name;
              const cardPair = item2.pair;
              createCard(cardImage, cardName, cardPair);
            } data.splice(item,1);

          }
        }
        );
    }
    );
  button.setAttribute('disabled', true);
}

button.addEventListener('click', startGame);

for (const item of difArray) {
  item.addEventListener('click', setDifficulty);
}

init();
