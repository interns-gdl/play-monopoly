//run main once the document is ready
$(document).ready(main);

//declare global variables here
const db = firebase.database().ref('/');
var gameRoom, player;

function main(){
    $('#btn-create-room').on('click', createRoom);
    $('#btn-go-to-join').on('click', goToJoinRoom);
    $('#btn-join-room').on('click', joinRoom);
}