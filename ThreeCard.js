// Create a deck of cards, maybe a deck function or something like that

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

const canvasWidth = 1000;
const canvasHeight = 1000;

/* ----------------- */

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(bg_color);
  angleMode(RADIANS);

  const startButton = createButton("Play Three Card!");
  startButton.id("startButton");
  startButton.position(
    canvasWidth / 2 - startButton.width / 2,
    canvasHeight / 2 - startButton.height / 2
  );

  const playerCountInput = createInput();
  playerCountInput.attribute("placeholder", "Enter Player Count...");
  playerCountInput.position(
    canvasWidth / 2 - playerCountInput.width / 2,
    canvasHeight / 2 + 25
  );

  startButton.mousePressed(() => {
    const playerCount = Number(playerCountInput.value());
    const errMsg = "Player count must be an integer between 2 and 6";
    if (
      typeof playerCount === "number" &&
      playerCount > 1 &&
      playerCount <= 6
    ) {
      clearMessageArea(errMsg, [canvasWidth / 2, canvasHeight / 2 + 65]);
      initialize(playerCount);
      startButton.remove();
      playerCountInput.remove();
    } else {
      printMsg(errMsg, [canvasWidth / 2, canvasHeight / 2 + 65]);
    }
  });

  // while (playerCount<=1){

  // }
}

//let results = shuffleDeck(1);
// deckd = results.deck_id;

// let cardsLeft = results.remaining;

//For later on
// textSize(32);
// textAlign(CENTER);
// text(`Cards Left: ${cardsLeft}`, width - width / 4, height / 2 + 200);

//drawNewCard(1);

function initialize(playerCount) {
  reshuffle(testDeck);
  const backCard = "https://deckofcardsapi.com/static/img/back.png";

  const deck_Container = createDiv();
  deck_Container.id("deck_Container");
  deck_Container.class("customDeckContainer");

  //placeCardonTable(backCard, [deckX, deckY], 0);

  const dealCardButton = createButton("Deal Cards");
  dealCardButton.id("dealCardButton");
  dealCardButton.parent(deck_Container);
  dealCardButton.mousePressed(() => dealCards(playerCount, 3));

  const deckImg = createImg(backCard, "card back");
  deckImg.parent(deck_Container);
  deckImg.class("deckImg");

  const reshuffleButton = createButton("Reshuffle Deck!");
  reshuffleButton.id("reshuffleButton");
  reshuffleButton.parent(deck_Container);
  reshuffleButton.mousePressed(() => reshuffle(testDeck));

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

function placeCardonTable(img_url, [x, y], rotation) {
  loadImage(img_url, (img) => {
    img.resize(100, 150);
    push();
    translate(x, y);
    rotate(rotation);
    imageMode(CENTER);
    image(img, 0, 0);
    pop();
  });
}

//-----------------//

async function getADeck() {
  let url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numDecks}`;
  const response = await fetch(url);
  const info = response.json();

  return info.deck_id;
}

function dealCards(playerCount, cardsPerPlayer) {
  const delay = 250;
  let p = 0;
  let round = 0;
  const spread = 0.15;
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  const r = 375;
  const interval = setInterval(() => {
    let base = 2 * PI * (p / playerCount);
    let offset = (round - (cardsPerPlayer - 1) / 2) * spread;
    let theta = base + offset;
    let x = cx + r * Math.cos(theta);
    let y = cy + r * Math.sin(theta);
    let rot = theta + PI / 2;
    cardFromDeck(testDeck, [x, y], rot);

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

async function cardFromDeck(deck_id, [x, y], rotation) {
  let url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`;

  let response = await fetch(url);
  const cardInfo = await response.json();
  const {
    cards: [{ image, value, suit }],
    remaining,
  } = cardInfo;
  const cardName = `${title(value)} of ${title(suit)}`;

  placeCardonTable(image, [x, y], rotation);

  if (remaining === 0) {
    //reshuffle(deck_id);
  }
  printMsg(`Cards remaining: ${remaining}`, [deckX + 125, deckY]);
}

async function reshuffle(deck_id) {
  let url = `https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`;
  return await fetch(url);
}

function printMsg(msg, [x, y]) {
  clearMessageArea(msg, [x, y]);
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(msg, x, y);
}

function clearMessageArea(msg, [x, y]) {
  const msgWidth = textWidth(msg) + 5;
  fill(bg_color);
  noStroke();
  rectMode(CENTER);
  rect(x, y, msgWidth, 30); // wipe the area
}
