//run main once the document is ready
$(document).ready(main);

//declare global variables here
const db = firebase.database().ref('/');
var gameRoom, player, admin;

function main(){
    $('#btn-create-room').on('click', createRoom);
    $('#btn-go-to-join').on('click', goToJoinRoom);
}

//this function will after the waiting room
function start(){
    $('header').html('It begins!')
}