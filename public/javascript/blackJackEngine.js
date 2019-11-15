//-- Variables --//
var deckOfCards = [];
var playerHandValue = 0;
var dealerVisibleHandValue = 0;
var dealerHandValue = 0;
var newDeckID;
var playerCardIndex = 1;
var dealerCardIndex = 2;
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

async function gameStart(){
  await deckID();
  await fetch(`https://deckofcardsapi.com/api/deck/${newDeckID}/draw/?count=4`)
    .then(async (response) => {
      if (response.ok) {
        var temp = await response.json();
        for(var i = 0; i < temp.cards.length; i++){
          var playerCard = document.getElementById(`c${playerCardIndex}`);
          var dealerCard = document.getElementById(`d${dealerCardIndex}`);

          if(temp.cards[i].value == "JACK" || temp.cards[i].value == "QUEEN" || temp.cards[i].value == "KING"){
            if(i%2 == 0){
              dealerHandValue += 10;
            }
            else{
              playerHandValue += 10;
            }
          }
          else if(temp.cards[i].value == "ACE"){
            if(i%2 == 0){
              dealerHandValue += 11;
            }
            else{
              playerHandValue += 11;
            }
          }
          else {
            if(i%2 == 0){
              dealerHandValue += parseInt(temp.cards[i].value);
            }
            else{
              playerHandValue += parseInt(temp.cards[i].value);
            }
          }
          if(i%2 == 0){
            if(i == 0){
              dealerCard.src = temp.cards[i].image;
              dealerCard.style.visibility = "visible";
            }
            else{
              dealerCard.style.visibility = "visible";
            }
            dealerCardIndex++;

            console.log("Dealer dealt")
            console.log("Dealer score: " + dealerHandValue)
          }
          else {
            playerCard.src = temp.cards[i].image;
            playerCard.style.visibility = "visible";
            playerCardIndex++;
            console.log("Player dealt")
          }
          //If first card dealt to dealer, display ONLY that value.
          if(i == 0){
            dealerVisibleHandValue = dealerHandValue;
          }
          document.getElementById("playerCounter").innerHTML = playerHandValue;
          document.getElementById("dealerCounter").innerHTML = dealerVisibleHandValue;
        }
        if(playerHandValue == 21){
          //BLACKJACK and PAYOUT
          gameStateReset();
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
        var playerCard = document.getElementById(`c${playerCardIndex}`);
        if(temp.cards[0].value == "JACK" || temp.cards[0].value == "QUEEN" || temp.cards[0].value == "KING"){
            playerHandValue += 10;
        }
        else if(temp.cards[0].value == "ACE"){
              playerHandValue += 11;
              if(playerHandValue > 21){
                playerHandValue -= 10;
              }
        }
        else {
            playerHandValue += parseInt(temp.cards[0].value);
        }
        playerCard.src = temp.cards[0].image;
        playerCard.style.visibility = "visible"
        playerCardIndex++;
        //BUST
        if(playerHandValue > 21){
          await gameStateReset();
        }
        document.getElementById("playerCounter").innerHTML = playerHandValue;
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
    await fetch(`https://deckofcardsapi.com/api/deck/${newDeckID}/draw/?count=1`)
      .then(async (response) => {
        if (response.ok) {
          var temp = await response.json();
          var dealerCard = document.getElementById(`d${dealerCardIndex}`);
          if(temp.cards[0].value == "JACK" || temp.cards[0].value == "QUEEN" || temp.cards[0].value == "KING"){
              dealerHandValue += 10;
          }
          else if(temp.cards[0].value == "ACE"){
                dealerHandValue += 11;
                if(dealerHandValue > 21){
                  dealerHandValue -= 10;
                }
          }
          else {
              dealerHandValue += parseInt(temp.cards[0].value);
          }
          dealerCard.src = temp.cards[0].image;
          dealerCard.style.visibility = "visible"
          dealerCardIndex++;
          document.getElementById("dealerCounter").innerHTML = dealerHandValue;
        }
       else {
          throw new Error('Response did not return 200');
        }
      })
      .catch(async (error) => {
          console.log(error);
      })
  }
  //BUST
  if(dealerHandValue > 21){
    await gameStateReset();
  }
}

async function gameStateReset(){
  dealerHandValue = 0;
  dealerCardIndex = 2;
  playerHandValue = 0;
  playerCardIndex = 1;
  document.getElementById("playerCounter").innerHTML = playerHandValue;
  document.getElementById("dealerCounter").innerHTML = dealerHandValue;
  cardReset = document.getElementsByClassName("card");
  for(var i = 0; i < cardReset.length; i++)
  {
    cardReset[i].style.visibility = "hidden";
  }
}
/*
    Display values/card images
        - change img http link to deckofcards API img
        - change counters innerHTML to corresponding values
*/
