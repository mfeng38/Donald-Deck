// JavaScript source code
console.log("navbar.js runs");
var mystats = document.getElementById("mystats");
var creatematch = document.getElementById("creatematch");
var joinmatch = document.getElementById("joinmatch");
var logout = document.getElementById("logout");
var soloBlackjack = document.getElementById("soloBlackjack");
var logo = document.getElementById("logo");

logo.addEventListener('click', function () {
    console.log("logo click");
    var username = document.getElementById("id").innerHTML;
    var form = document.createElement("form");
    form.setAttribute('method', 'post');
    form.setAttribute("action", "/mainMenu");
    var input = document.createElement("input");
    input.style.visibility = 'hidden';
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'id');
    input.setAttribute('value', `${username}`);
    form.appendChild(input);
    document.getElementsByTagName('body')[0].appendChild(form);
    form.submit();
    return;
});

if (mystats != null) {
    mystats.addEventListener('click', function () {
        var username = document.getElementById("id").innerHTML;
        //console.log(`click mystats: ${username}`);
        var form = document.createElement("form");
        form.setAttribute('method', 'post');
        form.setAttribute("action", "/mystats");
        var input = document.createElement("input");
        input.style.visibility = 'hidden';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'id');
        input.setAttribute('value', `${username}`);
        form.appendChild(input);
        document.getElementsByTagName('body')[0].appendChild(form);
        form.submit();
        return;
    });
}

if (creatematch != null) {
    creatematch.addEventListener('click', function () {
        var username = document.getElementById("id").innerHTML;
        var form = document.createElement("form");
        form.setAttribute('method', 'post');
        form.setAttribute("action", "/creatematch"); //Not developed yet, check index.js later for command
        var input = document.createElement("input");
        input.style.visibility = 'hidden';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'id');
        input.setAttribute('value', `${username}`);
        form.appendChild(input);
        document.getElementsByTagName('body')[0].appendChild(form);
        form.submit();
        return;
    });
}

if (soloBlackjack != null) {
    soloBlackjack.addEventListener('click', function () {
        var username = document.getElementById("id").innerHTML;
        console.log(`click soloblackjack: ${username}`);
        var form = document.createElement("form");
        form.setAttribute('method', 'post');
        form.setAttribute("action", "/soloBlackjack");
        var input = document.createElement("input");
        input.style.visibility = 'hidden';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'id');
        input.setAttribute('value', `${username}`);
        form.appendChild(input);
        document.getElementsByTagName('body')[0].appendChild(form);
        form.submit();
        return;
    });
}

if (joinmatch != null) {
    joinmatch.addEventListener('click', function () {
        var username = document.getElementById("id").innerHTML;
        var form = document.createElement("form");
        form.setAttribute('method', 'post');
        form.setAttribute("action", "/joinmatch");
        var input = document.createElement("input");
        input.style.visibility = 'hidden';
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'id');
        input.setAttribute('value', `${username}`);
        form.appendChild(input);
        document.getElementsByTagName('body')[0].appendChild(form);
        form.submit();
        return;
    });
}

if (logout != null) {
    logout.addEventListener('click', function () {
        window.location.href = "/";
    });
  
}

//for admin
