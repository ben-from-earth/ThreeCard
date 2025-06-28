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

function setup() {
  const width = 850;
  const height = 750;
  createCanvas(width, height);
  background("green");
  angleMode(DEGREES);

  let deckId;
  const backCard = "https://deckofcardsapi.com/static/img/back.png";
  placeCardonTable(backCard, [width - width / 4, height / 2], 0);

  shuffleDeck(1)
    .then((results) => {
      if (results) {
        deckId = results.deck_id;
        let button = createButton("Gimme a Card!");
        // let cardsLeft = results.remaining;
        button.position(width / 2 - button.width / 2, 25);

        //For later on
        // textSize(32);
        // textAlign(CENTER);
        // text(`Cards Left: ${cardsLeft}`, width - width / 4, height / 2 + 200);

        button.mousePressed(() => drawCards(deckId, 1));
      }
    })
    .catch((err) => {
      console.error("Error fetching deck:", err);
    });

  //drawNewCard(1);
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

function placeCardonTable(img_url, positionArr, rotation) {
  loadImage(img_url, (img) => {
    push();
    translate(positionArr[0], positionArr[1]);
    rotate(0 + rotation);
    imageMode(CENTER);
    image(img, 0, 0);
    pop();
  });
}

//-----------------//

function shuffleDeck(numDecks) {
  let url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numDecks}`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("failed to fetch deck.");
      return response.json();
    })
    .catch((err) => console.error("Failed to shuffle:", err));
}

function drawCards(deck_id, numCards) {
  let url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${numCards}`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      let cardsList = json.cards;
      for (let i = 0; i < numCards; i++) {
        let card = `${title(cardsList[i].value)} of ${title(
          cardsList[i].suit
        )}`;
        let rotationModifier = getRandomInt(-15, 15);
        let xposModifier = getRandomInt(-10, 10);
        let yposModifier = getRandomInt(-10, 10);
        placeCardonTable(
          cardsList[i].image,
          [width / 4 + xposModifier, height / 2 + yposModifier],
          rotationModifier
        );
        remaining = json.remaining;
      }
    })
    .catch((err) => console.error("Failed to draw a card:", err));
}

function drawNewCard(numCards) {
  let url = `https://deckofcardsapi.com/api/deck/new/draw/?count=${numCards}`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      let cardsList = json.cards;
      for (let i = 0; i < numCards; i++) {
        let card = `${title(cardsList[i].value)} of ${title(
          cardsList[i].suit
        )}`;
        createP(card);
      }
    })
    .catch((err) => console.error("Failed to draw a card:", err));
}

setup();
