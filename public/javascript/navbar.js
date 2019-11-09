// JavaScript source code
console.log("navbar.js runs");
var mystats = document.getElementById("mystats");
var creatematch = document.getElementById("mystats");
var joinmatch = document.getElementById("joinmatch");
var logout = document.getElementById("logout");

mystats.addEventListener('click', function () {
    var username = document.getElementById("id").innerHTML;
    //console.log(`click mystats: ${username}`);

    var form = document.createElement("form");
    form.setAttribute('method', 'post');
    form.setAttribute("action", "/mystats");
    var input = document.createElement("input");
    input.style.visibility = 'hidden';
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'user');
    input.setAttribute('value', `${username}`);
    form.appendChild(input);
    document.getElementsByTagName('body')[0].appendChild(form);
    form.submit();
    return;
});