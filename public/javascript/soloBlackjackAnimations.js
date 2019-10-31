// JavaScript soloBlackjack
// animations and placement of object
console.log("hello");
console.log(document.getElementById('Add10'));

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


document.getElementById('start').addEventListener('click', function () {
    //to start the game:
    document.getElementById("CurrentBet").style.visibility = "hidden";
    var bet = document.getElementById("CurrentBet").value;
    document.getElementById("bet").innerHTML = `Bet: ${bet}`;
    document.getElementById("bet").style.visibility = "visible";
    document.getElementById("Add10").style.display = "none";
    document.getElementById("start").style.display = "none";
});