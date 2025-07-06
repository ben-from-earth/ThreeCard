// Create a deck of cards, maybe a deck function or something like that

//const { createElement } = require("react");

//function deal(playerCount){ shuffle the deck, initialize the game state
//randomize deck
//deal three cards face down to each player
//deal 6 cards face up to each player
//place one card from the top of the deck face up in the middle
// }

//function discard(pile){
//Move all cards in played card pile to the discard pile
//}

//function play(playerCount){
//run deal(playerCount)
//choose three cards to place on top of three face down cards
//In order place a card from your deck that is higher than the card on the table
//Two is acceptable at anytime and reset the deck
//if all cards in hand lower than table card, draw all cards under and including table card and add to hand
//if 10 played or four cards in a row same rank send to discard pile
//if hand empty, draw left or right card from face up three on table
//if hand empty again on next turn use next card in order until face ups are exhausted
//if faceups exhausted use one from either side of facedown and logic plays out the same
//declare winner if all cards exhausted
// }

//

/* Program constants */

const deckX = 560;
const deckY = 500;

//training deck ID:
const testDeck = "jxtkjbblzhou";
const bg_color = "#006400";
const canvasHeight = 1000;
const cy = canvasHeight / 2;
const canvasWidth = 1000;
const cx = canvasWidth / 2;
const cardWidth = 100;
const cardHeight = 150;
const dealRadius = 0.375 * canvasWidth;

//initial items:
const playerCountInput = document.getElementById("playerCountQuery");
const mainDeck = document.getElementById("mainDeckContainer");
const cardsRemaining = document.getElementById("cardsRemaining");
const dealCardButton = document.getElementById("dealCardButton");
const reshuffleButton = document.getElementById("reshuffleButton");

const centerItemsHolder = document.getElementById("centerItemsHolder");

const startButton = document.getElementById("startButton");
const participants = [];

class Player {
  constructor(name) {
    this.name = name;
    this.cardsInHand = [];
  }
}
function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("gameContainer");
  startButton.addEventListener("click", () => {
    const playerCount = Number(playerCountInput.value);
    const errMsg = document.querySelector("#playerCountError");
    if (
      typeof playerCount === "number" &&
      playerCount > 1 &&
      playerCount <= 6
    ) {
      startButton.remove();
      playerCountInput.remove();
      errMsg.remove();
      centerItemsHolder.style.display = "flex";
      initialize(playerCount);
    } else {
      errMsg.style.visibility = "visible";
    }
  });
}

/* ----------------- */

function initialize(playerCount) {
  reshuffle(testDeck);
  cardsRemaining.style.visibility = "visible";
  for (let i = 1; i <= playerCount; i++) {
    participants.push(new Player(`Player ${i}`));
  }

  dealCardButton.addEventListener("click", () => {
    dealCards(playerCount, 3);
  });

  reshuffleButton.addEventListener("click", () => {
    reshuffle(testDeck);
  });

  //placeCardonTable(backCard, [deckX, deckY], 0);
  // const gameID = getADeck()
}

// Helper Functions //

function title(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getRandomInt(min, max) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function placeCardonTable(img_url, [x, y, theta, rotation]) {
  const card = createImg(img_url);

  card.size(cardWidth, cardHeight);
  const offsetX = x - cardWidth / 2;
  const offsetY = y - cardHeight / 2;
  card.position(offsetX, offsetY);
  card.style("transform", `rotate(${rotation}rad)`);
  card.style("transform-origin", "center center");
  card.addClass("playingCard");
  card.mouseOut(() => {
    card.position(offsetX, offsetY);
  });
  card.mouseOver(() => {
    const newR = dealRadius - 30;
    const newX = cx + newR * Math.cos(theta);
    const newY = cy + newR * Math.sin(theta);
    card.position(newX - cardWidth / 2, newY - cardHeight / 2);
  });
  card.mouseClicked(() => {
    card.parent("playedCards");
  });
}

//-----------------//

async function getADeck() {
  let url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numDecks}`;
  const response = await fetch(url);
  const info = response.json();

  return info.deck_id;
}

async function dealCards(playerCount, cardsPerPlayer) {
  const delay = 250;
  let p = 0;
  let round = 0;
  const spread = 0.15;
  const interval = setInterval(() => {
    let base = 2 * Math.PI * (p / playerCount);
    let offset = (round - (cardsPerPlayer - 1) / 2) * spread;
    let theta = base + offset;
    let x = cx + dealRadius * Math.cos(theta);
    let y = cy + dealRadius * Math.sin(theta);
    let rot = theta + Math.PI / 2;
    let placementMatrix = [x, y, theta, rot];
    cardFromDeck(testDeck, placementMatrix, p);

    p++;
    if (p >= playerCount) {
      p = 0;
      round++;
      if (round >= cardsPerPlayer) {
        clearInterval(interval);
      }
    }
  }, delay);
}

async function cardFromDeck(deck_id, [x, y, theta, rotation], p) {
  let url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`;

  let response = await fetch(url);
  const cardInfo = await response.json();
  const {
    cards: [{ image, value, suit }],
    remaining,
  } = cardInfo;
  const cardName = `${title(value)} of ${title(suit)}`;

  placeCardonTable(image, [x, y, theta, rotation]);

  if (remaining === 0) {
    //reshuffle(deck_id);
  }

  cardsRemaining.innerText = `Cards remaining: ${remaining}`;
  participants[p].cardsInHand.push({ image, value, suit });
}

async function reshuffle(deck_id) {
  let url = `https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`;
  return await fetch(url);
}
