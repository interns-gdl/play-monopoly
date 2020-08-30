function loadPlayers(){
    $('main').html('\
        <div class="container text-center m-4">\
            <h3>Players</h3>\
            <ul id="player-list" class="list-group mx-2"></ul>\
            <ul class="list-group m-5">\
                <li class="list-group-item list-group-item-success">Active</li>\
                <li class="list-group-item list-group-item-secondary">Disconected</li>\
            </ul>\
        </div>\
        ');

    gameRoom.on('value', snap => {
        game = snap.val();

        for (const nickname in game.players) {
            let color = game.players[nickname].active ? 'success': 'secondary';
            $('#' + nickname + '-w').remove();
            let li = `<li id="${ nickname }-w" class="list-group-item list-group-item-${ color }">${ nickname }</li>`
            $('#player-list').append(li);
        }
    });
}