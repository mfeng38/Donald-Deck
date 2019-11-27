//js for rebuys (client side)
//rebuys
var div = document.getElementById("rebuyPrompt");
div.display = "none";
var numcredits = document.getElementById('creditnumber');
if (numcredits < 500) {
    div.display = "block";
}

document.getElementById('rebuy').addEventListener('click', function () {
    //send post request to index.js
    var http = new XMLHttpRequest();
    http.open("POST", "/rebuy", true);
    http.send();
});