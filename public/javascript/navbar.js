// JavaScript source code
console.log("navbar.js runs");
var mystats = document.getElementById("mystats");
var creatematch = document.getElementById("mystats");
var joinmatch = document.getElementById("joinmatch");
var lotout = document.getElementById("logout");

mystats.addEventListener('click', function () {
        console.log(`click mystats`);
        
});

function functclicked(i) {
    //When click, post id
    var username = document.getElementById("id").innerHTML;
    console.log(`click mystats: ${username}`);
    $.post('\mystats', {user: `${username}`);
    /*idelements = document.querySelectorAll(".sid");
    var idelement = idelements.item(i);
    console.log(`boop: ${idelements}`);
    console.log(`boop: ${idelement} at ${i}`);
    sid = idelement.innerHTML;
    console.log(`boop: ${sid}`);
    document.getElementById("sid").value = `${sid}`;
    var form;*/
    form.submit();
    return;
}