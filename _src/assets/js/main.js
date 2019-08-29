'use strict';

const button = document.querySelector('.btn__js');
const board = document.querySelector('.board_js');
const text = document.querySelector('.result__textJs');
const opt4 = document.querySelector('.opt_4Js');
const difArray = document.querySelectorAll('.dif__option');
const backCardImage = 'assets/images/pokemon-logo.png';
let counter = 0;
let cardsArray = [];

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
  cardsArray.push(newElement);
}
function checkWin(){
  const storedValue = parseInt(localStorage.getItem('value'));
  if (counter === storedValue){
    text.innerHTML = '¡Has ganado!';
    button.removeAttribute('disabled');
    counter = 0;
    board.innerHTML='';
    cardsArray = [];
  }
}
const checkPair = (element) =>{
  const firstPair = localStorage.getItem('pair');
  if(firstPair !== null){
    const secondPair = element.getAttribute('dataPair');
    if(firstPair === secondPair){
      const pairArray = board.querySelectorAll(`[dataPair = '${firstPair}']`);
      for(const item of pairArray){
        item.classList.add('noVisibility');
      }
      localStorage.removeItem('pair');
      text.innerHTML = '¡Has encontrado una pareja!';
      counter += 2;

    }
    else{
      text.innerHTML = 'No son iguales';
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
    setTimeout (checkWin, 300);
  }
  else{
    const choosedPair = element.getAttribute('dataPair');
    localStorage.setItem('pair', choosedPair);
    element.setAttribute('disabled', true);
  }
};

function showCard(event){
  text.innerHTML = '';
  const selectedCard = event.currentTarget;
  const disabled = selectedCard.getAttribute('disabled');
  if(disabled === 'false'){
    selectedCard.setAttribute('disabled', true);
    const imgArray = selectedCard.querySelectorAll('.img');
    for (const item of imgArray){
      item.classList.toggle('hidden');
    }
    setTimeout(checkPair, 1000, selectedCard);
  }
}

function startGame(){
  const selectedDif = localStorage.getItem('value');
  const ENDPOINT = `https://pokeapi.co/api/v2/pokemon/`;
  fetch(ENDPOINT)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const cards = [];
      const selectedCards = [];
      for( let i = 0; i<= (selectedDif-1)/2; i++){
        let item = data.results[Math.floor(Math.random()*data.results.length)];
        cards.push(item);
        const index = data.results.indexOf(item);
        data.results.splice(index,1);
      }
      for(const item of cards){
        fetch(item.url)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            const pokemon = {
              'image':data.sprites.back_default,
              'name': data.name,
              'pair' : data.id
            };
            const pokemon2 = {
              'image':data.sprites.front_default,
              'name': data.name,
              'pair' : data.id
            };
            selectedCards.push(pokemon);
            selectedCards.push(pokemon2);
            // Cuándo se pinta esto?
            console.log('--- AHORA Y AQUÍ TENGO LOS DATOS ---');
            console.log(selectedCards);
            console.log('--- SERÍA GUAY, CONSEGUIR TODOS LOS DATOS Y LUEGO PINTAR, SI SOLO TUVIÉSEMOS UNA FORMA DE HACER PETICIONES Y CUANDO TODAS ESTÉN HACER ALGO ---');
            console.log('--- TAMBIÉN MOLARÍA HACER FUNCIONES FLECHA ---');
          });
      }
      console.log('--- AQUÍ PUEDO O NO PUEDO TENERLOS, SEGURAMENTE NO PORQUE LAS PETICIONES VAN A SU ROLLO ---');
      console.log('soy selected', selectedCards);
      console.log('soy la long de selected', selectedCards.length);

      for(const item of selectedCards){
        console.log('soy un elemento de', selectedCards);
        const newElement = createCard(item.image, item.name, item.pair);
        board.appendChild(newElement);
        newElement.addEventListener('click', showCard);
      }
    });

  button.setAttribute('disabled', true);
}

button.addEventListener('click', startGame);

for (const item of difArray){
  item.addEventListener('click', setDifficulty);
}

init ();
