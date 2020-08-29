//run main once the document is ready
$(document).ready(main);

//declare global variables here
const db = firebase.database().ref('/');
var gameRoom, player;

function main(){
    $('#btn-create-room').on('click', createRoom);
}

function createRoom(){
    console.log('lol it works');
    //push a new game
    gameRoom = db.push();
    $('.game-room-code').html(gameRoom.key);
    $('#create-room').addClass('d-none');
    $('#create-player').removeClass('d-none');
}