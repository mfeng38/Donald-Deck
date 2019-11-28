//Readying up
document.getElementById('readyUp').addEventListener('click', function () {
    document.getElementById("roomID").style.visibility= "hidden";
    document.getElementById("readyUp").style.display = "none";
    document.getElementById("CurrentBet").style.visibility= "visible";
    document.getElementById("startMatch").style.visibility = "visible";
    showBetButtons();

});

document.getElementById('startMatch').addEventListener('click', function () {
    var bet = document.getElementById("CurrentBet").value;
    if (Number.isNaN(bet) || bet==0||bet==undefined){
        return;
    }
    else {
        console.log(bet);
        document.getElementById('startMatch').style.visibility = 'hidden';
        document.getElementById("CurrentBet").style.visibility = "hidden";
        document.getElementById("multicontainer").style.visibility = "hidden";

        document.getElementById("bet").innerHTML = `Bet: ${bet}`;
        document.getElementById("bet").style.visibility = "visible";

        document.getElementById("Player").style.visibility = "visible";
        document.getElementById("Dealer").style.visibility = "visible";
        document.getElementById("playerCounter").style.visibility = "visible";
        document.getElementById("dealerCounter").style.visibility = "visible";
        document.getElementById("hit").style.visibility = "visible";
        document.getElementById("stay").style.visibility = "visible";
        document.getElementById("viewLeaderboard").style.visibility = "visible";
        hideBetButtons();
    }
});

//Fill this boi with leaderboard stuff
document.getElementById('viewLeaderboard').addEventListener('click', function() {

});
