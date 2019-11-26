//js for rebuys (client side)
//rebuys
var numcredits = document.getElementById('creditnumber');
if (numcredits < 500) {
    document.getElementById('rebuys').style.visibility = "visible";
    document.getElementById('rebuyPrompt').style.visibility = "visible";
}

document.getElementById('rebuy').addEventListener('click', function () {
    //send post request to index.js
    var http = new XMLHttpRequest();
    http.open("POST", "/rebuy", true);
    http.send();
});
