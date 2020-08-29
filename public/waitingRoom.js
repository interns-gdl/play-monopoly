function goToJoinRoom(){
    $('#create-room').addClass('d-none');
    $('#join-room').removeClass('d-none');
    $('#btn-join-room').on('click', joinRoom);
    $('#room-code').focus();
    $('#room-code').keypress((event)=>{
        if (event.which === 13){
            joinRoom();
        }
    });
}

function goToCreatePlayer(){
    $('#create-room').addClass('d-none');
    $('#join-room').addClass('d-none');
    $('#create-player').removeClass('d-none');
    $('#btn-create-player').on('click', createPlayer);
    $('#btn-go-to-recover-player').on('click', goToRecoverPlayer);
    $('#player-nickname').focus();
    $('#player-nickname').keypress((event)=>{
        if (event.which === 13){
            createPlayer();
        }
    });
}

function goToRecoverPlayer(){
    $('#create-player').addClass('d-none');
    $('#recover-player').removeClass('d-none');

    gameRoom.on('value', snap => {
        let game = snap.val();
        for (const nickname in game) {
            let active = game[nickname].active;
            let isAdmin = game[nickname].admin;
            if (!active){
                $('#' + nickname + '-inactive').remove();
                let li = `<li id="${ nickname }-inactive" class="list-group-item">${ nickname }</li>`
                $('#inactive-players-list').append(li);
                $('#' + nickname + '-inactive').click(()=>{
                    recoverPlayer(nickname, isAdmin);
                })
            }
        }

        if($('#inactive-players-list').children().length === 0){
            let li = `<li id="none-inactive" class="list-group-item">There isn't any profile to recover</li>`
            $('#inactive-players-list').append(li);
        }
    })
}

function recoverPlayer(nickname, isAdmin){
    gameRoom.off('value');
    player = gameRoom.child(nickname);
    admin = isAdmin;

    $('.player-nickname').html(nickname);
    player.update({
        active:true
    });
    player.onDisconnect().update({
        active:false
    });

    wait();
}

async function createRoom(){
    admin = true;
    await setGameRoom();
    goToCreatePlayer();
}

async function joinRoom(){
    admin = false;
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
        wait();
    }else{
        $('#alert-wrong-name').removeClass('d-none');
    }
}

function wait(){
    $('#create-player').addClass('d-none');
    $('#recover-player').addClass('d-none');
    $('#waiting').removeClass('d-none');

    gameRoom.on('value', snap => {
        game = snap.val();
        
        for (const nickname in game) {
            let color = game[nickname].active ? 'success': 'danger';
            $('#' + nickname + '-w').remove();
            let li = `<li id="${ nickname }-w" class="list-group-item list-group-item-${ color }">${ nickname }</li>`
            $('#waiting-player-list').append(li);
        }
    });

    if(!admin){
        $('#btn-start-game').remove();
    }else{
        $('#btn-start-game').click(startGame);
    } 
}

function startGame(){
    gameRoom.off();
    $('#waiting-room').remove();
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
        active: true,
        admin: admin
    })
    player.onDisconnect().update({
        active:false
    });
    return true;
}