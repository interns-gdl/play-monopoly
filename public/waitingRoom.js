function goToJoinRoom(){
    $('#create-room').addClass('d-none');
    $('#join-room').removeClass('d-none');
}

function goToCreatePlayer(){
    $('#create-room').addClass('d-none');
    $('#join-room').addClass('d-none');
    $('#create-player').removeClass('d-none');
}

async function createRoom(){
    await setGameRoom();
    goToCreatePlayer();
}

async function joinRoom(){
    let code = $('#room-code').val();
    let validRoom = await setGameRoom(code);
    if (validRoom){
        goToCreatePlayer();
    }else{
        //create error alert and show it
        $('#alert-wrong-code').removeClass('d-none');
    }
}

async function createPlayer(){
    let nickname = $('#player-nickname').val();
    let validName = await setPlayer(nickname);
    if (validName){
        $('#create-player').addClass('d-none');
        $('#waiting').removeClass('d-none');
    }else{
        $('#alert-wrong-name').removeClass('d-none');
    }

}

async function setGameRoom(code=null){
    //check if a code was passed
    if(!code){
        //create a new game if not
        gameRoom = db.push();
    }else{
        //check if the code passed does exist
        gameRoom = db.child(code);
        const snap = await gameRoom.once('value');

        //return false if it doesn´t
        if (snap.val() === null) return false;
    }

    //set the game room code to HTML
    $('.game-room-code').html(gameRoom.key);
    return true;
}

async function setPlayer(nickname){
    if (nickname === '') return false;
    if (nickname.includes('.')) return false;
    if (nickname.includes('#')) return false;
    if (nickname.includes('$')) return false;
    if (nickname.includes('[')) return false;
    if (nickname.includes(']')) return false;
    
    player = gameRoom.child(nickname);
    const snap = await player.once('value');

    if (snap.val() !== null) return false;

    $('.player-nickname').html(nickname);
    player.set({
        active: true
    })
    return true;
}