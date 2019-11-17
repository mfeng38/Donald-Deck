// JavaScript soloBlackjack
// animations and placement of object
console.log(document.getElementById(CurrentBet.value));

document.getElementById('Add5').addEventListener('click', function () {
    var currbet = document.getElementById("CurrentBet").value;
    console.log("click:", parseInt(currbet));
    var numcoins = parseInt(currbet);
    if (Number.isNaN(numcoins)) {
        numcoins = 5;
    }
    else {
        numcoins = numcoins + 5;
    }
    document.getElementById("CurrentBet").innerHTML = "Current Bet: " + numcoins;
    document.getElementById("CurrentBet").value = numcoins;
});
document.getElementById('Add10').addEventListener('click', function () {
    //Add10 turn current Bet to 
    
    var currbet = document.getElementById("CurrentBet").value;
    console.log("click:", parseInt(currbet));
    var numcoins = parseInt(currbet);
    if (Number.isNaN(numcoins)) {
        numcoins = 10;
        console.log(numcoins);
    }
    else {
        numcoins = numcoins + 10;
    }
    document.getElementById("CurrentBet").innerHTML = "Current Bet: " + numcoins;
    document.getElementById("CurrentBet").value = numcoins;
});
document.getElementById('Add25').addEventListener('click', function () {
    var currbet = document.getElementById("CurrentBet").value;
    console.log("click:", parseInt(currbet));
    var numcoins = parseInt(currbet);
    if (Number.isNaN(numcoins)) {
        numcoins = 25;
    }
    else {
        numcoins = numcoins + 25;
    }
    document.getElementById("CurrentBet").innerHTML = "Current Bet: " + numcoins;
    document.getElementById("CurrentBet").value = numcoins;
});
document.getElementById('Add100').addEventListener('click', function () {
    var currbet = document.getElementById("CurrentBet").value;
    console.log("click:", parseInt(currbet));
    var numcoins = parseInt(currbet);
    if (Number.isNaN(numcoins)) {
        numcoins = 100;
    }
    else {
        numcoins = numcoins + 100;
    }
    document.getElementById("CurrentBet").innerHTML = "Current Bet: " + numcoins;
    document.getElementById("CurrentBet").value = numcoins;
});
document.getElementById('start').addEventListener('click', function () {
    //to start the game:
        
    document.getElementById("Add5").style.visibility = "visible";
    document.getElementById("Add10").style.visibility = "visible";
    document.getElementById("Add25").style.visibility = "visible";
    document.getElementById("Add100").style.visibility = "visible";
    document.getElementById("CurrentBet").style.visibility= "visible";
    document.getElementById("start").style.display = "none";
    document.getElementById("startround").style.visibility = "visible";
});
document.getElementById('startround').addEventListener('click', function () {
    document.getElementById('startround').style.visibility = 'hidden';
    document.getElementById("CurrentBet").style.visibility = "hidden";
    var bet = document.getElementById("CurrentBet").value;
    document.getElementById("bet").innerHTML = `Bet: ${bet}`;
    document.getElementById("bet").style.visibility = "visible";
    moveBetButtonsLeft();
    document.getElementById("CurrentBet").style.visibility = "hidden";
    
    document.getElementById("Player").style.visibility = "visible";
    document.getElementById("Dealer").style.visibility = "visible";
    document.getElementById("playerCounter").style.visibility = "visible";
    document.getElementById("dealerCounter").style.visibility = "visible";

    var cards = document.getElementsByClassName("card")
    for (var i = 0; i < cards.length; i++) {
        cards[i].style.visibility = "visible";
    }
    document.getElementById("backofcard").style.visibility = "hidden";
    document.getElementById("hit").style.visibility = "visible";
    document.getElementById("stay").style.visibility = "visible";
});

function moveBetButtonsLeft() {
    document.getElementById("Add5").style.left = "10%";
    document.getElementById("Add10").style.left = "10%";
    document.getElementById("Add25").style.left = "10%";
    document.getElementById("Add100").style.left = "10%";
}

function moveBetButtonsCenter() {
    document.getElementById("Add5").style.left = "50%";
    document.getElementById("Add10").style.left = "50%";
    document.getElementById("Add25").style.left = "50%";
    document.getElementById("Add100").style.left = "50%";
}
function hideBetButtons() {
    document.getElementById("Add5").style.visibility = "hidden";
    document.getElementById("Add10").style.visibility = "hidden";
    document.getElementById("Add25").style.visibility = "hidden";
    document.getElementById("Add100").style.visibility = "hidden";
}
function showBetButtons() {
    document.getElementById("Add5").style.visibility = "visible";
    document.getElementById("Add10").style.visibility = "visible";
    document.getElementById("Add25").style.visibility = "visible";
    document.getElementById("Add100").style.visibility = "visible";
}