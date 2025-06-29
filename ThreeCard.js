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

const deckX = 550 + 152 / 2;
const deckY = 500;

//training deck ID:
const testDeck = "jxtkjbblzhou";

bg_color = "#006400";

/* ----------------- */

function setup() {
  const width = 1000;
  const height = 1000;
  createCanvas(width, height);
  background(bg_color);
  angleMode(DEGREES);

  const startButton = createButton("Play Three Card!");
  startButton.id("startButton");
  startButton.position(
    width / 2 - startButton.width / 2,
    height / 2 - startButton.height / 2
  );

  startButton.mousePressed(() => {
    initialize();
    startButton.remove();
  });

  //let results = shuffleDeck(1);
  // deckd = results.deck_id;

  // let cardsLeft = results.remaining;

  //For later on
  // textSize(32);
  // textAlign(CENTER);
  // text(`Cards Left: ${cardsLeft}`, width - width / 4, height / 2 + 200);

  //drawNewCard(1);
}

function initialize() {
  const backCard = "https://deckofcardsapi.com/static/img/back.png";

  const deck_Container = createDiv();
  deck_Container.id("deck_Container");
  deck_Container.class("customDeckContainer");

  //placeCardonTable(backCard, [deckX, deckY], 0);

  const dealCardButton = createButton("Gimme a Card!");
  dealCardButton.id("dealCardButton");
  dealCardButton.parent(deck_Container);
  dealCardButton.mousePressed(() => drawCards(testDeck, 1));

  const deckImg = createImg(backCard, "card back");
  deckImg.parent(deck_Container);
  deckImg.class("deckImg");

  const reshuffleButton = createButton("Reshuffle Deck!");
  reshuffleButton.id("reshuffleButton");
  reshuffleButton.parent(deck_Container);
  reshuffleButton.mousePressed(() => reshuffle(testDeck));
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
    rotate(0 + rotation);
    imageMode(CENTER);
    image(img, 0, 0);
    pop();
  });
}

//-----------------//

async function shuffleDeck(numDecks) {
  let url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numDecks}`;
  const response = await fetch(url);
  return response.json();
}

async function drawCards(deck_id, numCards) {
  let url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${numCards}`;

  let response = await fetch(url);
  const cardfromDeck = await response.json();
  const cardsList = cardfromDeck.cards;
  for (let i = 0; i < numCards; i++) {
    //let card = `${title(cardsList[i].value)} of ${title(cardsList[i].suit)}`;
    let rotationModifier = getRandomInt(-15, 15);
    let xposModifier = getRandomInt(-10, 10);
    let yposModifier = getRandomInt(-10, 10);
    placeCardonTable(
      cardsList[i].image,
      [width / 2 - 50 + xposModifier, height / 2 + yposModifier],
      rotationModifier
    );
    remaining = cardfromDeck.remaining;
    if (remaining === 0) {
      reshuffle(deck_id);
    }
    printMsg(`Cards remaining: ${remaining}`, [deckX + 115, deckY]);
  }
}

async function reshuffle(deck_id) {
  let url = `https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`;
  printMsg(`Deck Shuffled!`, [deckX - 10, deckY + 130]);
  fill(bg_color);
  noStroke();
  rectMode(CENTER);
  rect(width / 2 - 50, height / 2, 175, 250); // wipe the area
  return await fetch(url);
}

function printMsg(msg, [x, y]) {
  clearMessageArea(msg.length, x, y);
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(msg, x, y);
}

function clearMessageArea(msgWidth, x, y) {
  fill(bg_color);
  noStroke();
  rectMode(CENTER);
  rect(x, y, Math.ceil(msgWidth * 8), 30); // wipe the area
}
