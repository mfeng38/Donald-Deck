//-- Variables --//
var deckOfCards = [];
var playerHandValue = 0;
var dealerHandValue = 0;
var newDeckID;
var cardIndex = 0;

// Functions to be implemented //
/*
    Shuffle & grab cards from API
        - fetch from API
        - store card values in deckOfCards

*/

async function deckID(){
  await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(async (response) => {
      if (response.ok) {
        var temp = await response.json();
        newDeckID = temp.deck_id;
      } else {
        throw new Error('Response did not return 200');
      }
    })
    .catch(async (error) => {
        console.log(error);
    })
}

// TO DO: ADD DEALER VALUE DISPLAY, HIDE CARD BACK SLOTS TILL DEALT CARD
async function gameStart(){
  await deckID();
  await fetch(`https://deckofcardsapi.com/api/deck/${newDeckID}/draw/?count=3`)
    .then(async (response) => {
      if (response.ok) {
        var temp = await response.json();
        for(var i = 0; i < temp.cards.length; i++){
          var playerCard = document.getElementById(`c${cardIndex}`);
          if(temp.cards[i].value == "JACK" || temp.cards[i].value == "QUEEN" || temp.cards[i].value == "KING"){
            if(i == 2){
              dealerHandValue += 10;
            }
            else{
              playerHandValue += 10;
            }
          }
          else if(temp.cards[i].value == "ACE"){
            if(i == 2){
              dealerHandValue += 11;
            }
            else{
              playerHandValue += 11;
            }
          }
          else {
            if(i == 2){
              dealerHandValue += parseInt(temp.cards[i].value);
            }
            else{
              playerHandValue += parseInt(temp.cards[i].value);
            }
          }
          if(i == 2){
            document.getElementById("dealer1").src = temp.cards[i].image;
          }
          else {
            playerCard.src = temp.cards[i].image;
            //playerCard.style.visibility = "visible"
            cardIndex++;
          }
          document.getElementById("playerCounter").innerHTML = playerHandValue;
        }
        if(playerHandValue == 21){
          //BLACKJACK and PAYOUT
          cardIndex = 0;
        }
      } else {
        throw new Error('Response did not return 200');
      }
    })
    .catch(async (error) => {
        console.log(error);
    })
}
/*
    convert card value to usable value
        - A -> 11 or 1
        - 2-9 -> 2-9
        - J, Q, K -> 10
*/

/*
    Hit or stand actions
        - check if player total <= 21
            - if > 21, continue to next player/dealer action
            - if <= 21, continue until player chooses stand
*/

//STAND ONCLICK CALLS DEALER AI
//NEED TO IMPLEMENT WHAT BUST SHOULD LOOK LIKE
async function hit(){
  await fetch(`https://deckofcardsapi.com/api/deck/${newDeckID}/draw/?count=1`)
    .then(async (response) => {
      if (response.ok) {
        var temp = await response.json();
        var playerCard = document.getElementById(`c${cardIndex}`);
        if(temp.cards[i].value == "JACK" || temp.cards[i].value == "QUEEN" || temp.cards[i].value == "KING"){
            playerHandValue += 10;
        }
        else if(temp.cards[i].value == "ACE"){
              playerHandValue += 11;
              if(playerHandValue > 21){
                playerHandValue -= 10;
              }
        }
        else {
            playerHandValue += parseInt(temp.cards[i].value);
        }
        playerCard.src = temp.cards[i].image;
        //playerCard.style.visibility = "visible"
        cardIndex++;
        document.getElementById("playerCounter").innerHTML = playerHandValue;
        if(playerHandValue > 21){
          //BUST
          cardIndex = 0;
        }
      }
     else {
        throw new Error('Response did not return 200');
      }
    })
    .catch(async (error) => {
        console.log(error);
    })
}

/*
    Dealer AI
        - if value >= 17, stay
        - else, hit

*/

async function dealer(){
  while(dealerHandValue < 17){
    //DEALER HIT
  }
}
/*
    Display values/card images
        - change img http link to deckofcards API img
        - change counters innerHTML to corresponding values
*/
