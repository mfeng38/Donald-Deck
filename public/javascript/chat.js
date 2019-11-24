// JavaScript for chat

var socket = io();
var el = document.getElementById('test');
socket.on('time',function(timeString){
    el.innerHTML = 'Time: ' + timeString;
});
socket.on('connect',function(){});
var form = document.getElementById('chat');
//form.addEventListener('submit', sendmsg(event));
function sendmsg(){
    //event.preventDefault();
    console.log('hi');
    var msg = document.getElementById('msgin');
    socket.emit('chat msg',msg.value);
    msg.value='';
    return false;
}
		
		
socket.on('chat msg',function(msg){
    ('#messages').append($('<li>').html(msg));
});